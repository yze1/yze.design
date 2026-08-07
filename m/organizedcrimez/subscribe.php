<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

$configPaths = [
    __DIR__ . '/private-config.php',
    dirname(__DIR__) . '/private-config.php',
    dirname(__DIR__, 2) . '/private-config.php',
    ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/../private-config.php',
    ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/private-config.php',
];
$configPath = null;
$fallbackConfig = [
    'brevo_api_key' => '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',
    'brevo_list_id' => 2,
];

foreach ($configPaths as $candidatePath) {
    if ($candidatePath !== '' && is_readable($candidatePath)) {
        $configPath = $candidatePath;
        break;
    }
}

$config = $configPath === null ? $fallbackConfig : require $configPath;
$apiKey = $config['brevo_api_key'] ?? '';
$listId = (int) ($config['brevo_list_id'] ?? 0);

if ($apiKey === '' || $listId <= 0) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Server configuration invalid.']);
    exit;
}

$email = trim((string) ($_POST['email'] ?? ''));
$honeypot = trim((string) ($_POST['website'] ?? ''));

if ($honeypot !== '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Something went wrong. Please try again.']);
    exit;
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Enter a valid email address.']);
    exit;
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateKey = hash('sha256', $clientIp);
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'ocz-subscribe-' . $rateKey . '.json';
$now = time();
$windowSeconds = 10 * 60;
$maxAttempts = 5;
$recentAttempts = [];

if (is_readable($rateFile)) {
    $stored = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($stored)) {
        $recentAttempts = array_values(array_filter($stored, static function ($timestamp) use ($now, $windowSeconds) {
            return is_int($timestamp) && $timestamp > ($now - $windowSeconds);
        }));
    }
}

if (count($recentAttempts) >= $maxAttempts) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'message' => 'Something went wrong. Please try again.']);
    exit;
}

$recentAttempts[] = $now;
file_put_contents($rateFile, json_encode($recentAttempts), LOCK_EX);

$payload = json_encode([
    'email' => $email,
    'listIds' => [$listId],
    'updateEnabled' => true,
]);

$headers = [
    'accept: application/json',
    'api-key: ' . $apiKey,
    'content-type: application/json',
];
$responseBody = false;
$statusCode = 0;

if (function_exists('curl_init')) {
    $ch = curl_init('https://api.brevo.com/v3/contacts');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_TIMEOUT => 15,
    ]);

    $responseBody = curl_exec($ch);
    $curlError = curl_error($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($curlError !== '') {
        $responseBody = false;
    }
} else {
    $httpHeaders = implode("\r\n", $headers);
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => $httpHeaders,
            'content' => $payload,
            'timeout' => 15,
            'ignore_errors' => true,
        ],
    ]);
    $responseBody = file_get_contents('https://api.brevo.com/v3/contacts', false, $context);
    $statusLine = $http_response_header[0] ?? '';
    if (preg_match('/\s(\d{3})\s/', $statusLine, $matches)) {
        $statusCode = (int) $matches[1];
    }
}

if ($responseBody === false) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'message' => 'Something went wrong. Please try again.']);
    exit;
}

if ($statusCode >= 200 && $statusCode < 300) {
    echo json_encode(['ok' => true, 'message' => 'Subscribed.']);
    exit;
}

$decoded = json_decode((string) $responseBody, true);
$responseMessage = strtolower((string) ($decoded['message'] ?? ''));
$duplicate = is_array($decoded)
    && (($decoded['code'] ?? '') === 'duplicate_parameter'
        || strpos($responseMessage, 'already exist') !== false);

if ($duplicate) {
    echo json_encode(['ok' => true, 'message' => 'Subscribed.']);
    exit;
}

http_response_code(502);
echo json_encode(['ok' => false, 'message' => 'Something went wrong. Please try again.']);
