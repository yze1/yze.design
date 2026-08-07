const videoPlayer = document.querySelector('.video-player')

function videoEnded(){
  left.style.display = "none"
  right.style.display = "none"
  intro.style.display = "none"
}

//left
const left = videoPlayer.querySelector('.left')
const leftButton = document.querySelector('.leftbutton')

left.style.display = "none"

leftButton.addEventListener('click', (e) => {
  left.style.display = "flex"

  if(left.paused){
    left.play()
  } else {
    left.pause()
  }
})


//right
const right = videoPlayer.querySelector('.right')
const rightButton = document.querySelector('.rightbutton')

right.style.display = "none"

rightButton.addEventListener('click', (e) => {
  right.style.display = "flex"

  if(right.paused){
    right.play()
  } else {
    right.pause()
  }
})

//intro
const intro = videoPlayer.querySelector('.intro')
const topButton = document.querySelector('.topbutton')

intro.style.display = "none"

topButton.addEventListener('click', (e) => {
  intro.style.display = "flex"

  if(intro.paused){
    intro.play()
  } else {
    intro.pause()
  }
})




