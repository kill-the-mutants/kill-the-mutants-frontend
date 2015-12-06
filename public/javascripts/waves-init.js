var config = {
    // How long Waves effect duration
    // when it's clicked (in milliseconds)
    duration: 5000,

    // Delay showing Waves effect on touch
    // and hide the effect if user scrolls
    // (0 to disable delay) (in milliseconds)
    delay: 200
};
Waves.attach('.waves', ['waves-block']);
Waves.init(config);
