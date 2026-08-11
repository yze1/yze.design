<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

$configPath = ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/../private-config.php';
$config = is_readable($configPath) ? require $configPath : [];
$apiKey = $config['google_gemini_api_key'] ?? '';

if ($apiKey === '') {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration invalid.']);
    exit;
}

$body = file_get_contents('php://input');
$payload = json_decode($body ?: '', true);
if (!is_array($payload) || !isset($payload['contents']) || strlen($body ?: '') > 20000) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request.']);
    exit;
}

$rateFile = sys_get_temp_dir() . '/yze-gemini-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$now = time();
$attempts = is_readable($rateFile) ? json_decode((string) file_get_contents($rateFile), true) : [];
$attempts = array_values(array_filter(is_array($attempts) ? $attempts : [], fn($time) => is_int($time) && $time > $now - 600));
if (count($attempts) >= 20) {
    http_response_code(429);
    echo json_encode(['error' => 'Too many requests. Please try again later.']);
    exit;
}
$attempts[] = $now;
file_put_contents($rateFile, json_encode($attempts), LOCK_EX);

$ch = curl_init('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'x-goog-api-key: ' . $apiKey],
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_TIMEOUT => 30,
]);
$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$failed = $response === false;
curl_close($ch);

if ($failed) {
    http_response_code(502);
    echo json_encode(['error' => 'Gemini request failed.']);
    exit;
}

http_response_code($status ?: 502);
echo $response;
