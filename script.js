AOS.init({
    duration: 1200,
    once: true
});

const words = ["Siraphop Thippila"];
let index = 0;
let charIndex = 0;
const typingElement = document.getElementById("typing");

function type() {
    if (charIndex < words[index].length) {
        typingElement.innerHTML += words[index].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typingElement.innerHTML = words[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        index = (index + 1) % words.length;
        setTimeout(type, 500);
    }
}

type();

const profileImg = document.getElementById("profile-img");
let isAnime = false;

profileImg.addEventListener("click", () => {
    anime({
        targets: '#profile-img',
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInOutQuad',
        complete: function() {

            profileImg.src = isAnime ? "profile2.jpg" : "profile2.jpg";
            isAnime = !isAnime;

            anime({
                targets: '#profile-img',
                opacity: [0, 1],
                duration: 500,
                easing: 'easeInOutQuad'
            });
        }
    });
});