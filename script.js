document.addEventListener('DOMContentLoaded', function () {
    const shotBarContainer = document.getElementById('shot-bar-container');
    const shotBar = document.getElementById('shot-bar');
    const cueAction = document.querySelector('.user-action');
    const cueBall = document.querySelector('.cue');
    let isDragging = false;
    let shotPower = 0;

    shotBarContainer.addEventListener('mousedown', () => {
        isDragging = true;
        shotBarContainer.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            shotBarContainer.style.cursor = 'grab';
            endShot();
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const containerRect = shotBarContainer.getBoundingClientRect();
            const mouseY = event.clientY - containerRect.top;

            // Limit mouseY to the height of the shot bar
            const clampedMouseY = Math.min(Math.max(mouseY, 0), containerRect.height);

            shotBar.style.height = `${clampedMouseY}px`;
            shotPower = (clampedMouseY / containerRect.height) * 100;
        }
    });

    cueAction.addEventListener('mousedown', (event) => {
        // Calculate the initial angle based on mouse position
        const cueRect = cueAction.getBoundingClientRect();
        const mouseX = event.clientX - cueRect.left;
        const mouseY = event.clientY - cueRect.top;
        const initialAngle = Math.atan2(mouseY - cueRect.height / 2, mouseX - cueRect.width / 2) * (180 / Math.PI);

        document.addEventListener('mousemove', handleCueDrag);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleCueDrag);
            endShot();
        });

        function handleCueDrag(event) {
            // Calculate the new angle based on mouse position
            const newX = event.clientX - cueRect.left;
            const newY = event.clientY - cueRect.top;
            const newAngle = Math.atan2(newY - cueRect.height / 2, newX - cueRect.width / 2) * (180 / Math.PI);

            // Update the cue ball angle
            cueBall.style.transform = `rotate(${newAngle - initialAngle}deg)`;
        }
    });

    function endShot() {
        // Implement logic for ending the shot and moving the cue ball
        // Use the shotPower and cueBall angle to determine the shot parameters
        console.log(`Shot Power: ${shotPower}% | Shot Angle: ${getCueBallAngle()}deg`);
    }

    function getCueBallAngle() {
        // Extract the current rotation angle from the transform property
        const transform = window.getComputedStyle(cueBall).getPropertyValue('transform');
        const matrix = new DOMMatrix(transform);
        return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    }
});