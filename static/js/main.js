document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    // Input type toggles
    const imageInputRadio = document.getElementById('imageInput');
    const textInputRadio = document.getElementById('textInput');
    const imageUploadSection = document.getElementById('imageUploadSection');
    const textInputSection = document.getElementById('textInputSection');

    // Image upload elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadPreview = document.getElementById('uploadPreview');
    const arrangeContainer = document.getElementById('arrangeContainer');
    const sortableList = document.getElementById('sortableList');
    const previewBtn = document.getElementById('previewBtn');
    const previewContainer = document.getElementById('previewContainer');
    const stitchedPreview = document.getElementById('stitchedPreview');

    // Text input elements
    const markSchemeText = document.getElementById('markSchemeText');
    const processTextBtn = document.getElementById('processTextBtn');

    // Common elements
    const extractBtn = document.getElementById('extractBtn');
    const markSchemeContainer = document.getElementById('markSchemeContainer');
    const markSchemeContent = document.getElementById('markSchemeContent');
    const submitBtn = document.getElementById('submitBtn');
    const viewJsonBtn = document.getElementById('viewJsonBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    const validationMessages = document.getElementById('validationMessages');
    const validationErrorsList = document.getElementById('validationErrorsList');


    // JSON Modal elements
    const jsonModal = document.getElementById('jsonModal');
    const jsonOutput = document.getElementById('jsonOutput');
    const copyJsonBtn = document.getElementById('copyJsonBtn');

    // Image Preview Modal elements
    const imagePreviewModal = document.getElementById('imagePreviewModal');
    const enlargedImage = document.getElementById('enlargedImage');

    // Form inputs
    const subjectInput = document.getElementById('subjectInput');
    const subjectDropdown = document.getElementById('subjectDropdown');
    const titleInput = document.getElementById('titleInput');
    const qualificationLevelSelect = document.getElementById('qualificationLevelSelect');
    const examBoardSelect = document.getElementById('examBoardSelect');

    // State
    let uploadedFiles = [];
    let sortable = null;
    let markSchemeData = null;
    let currentInputType = 'image'; // Default input type
    let currentSeason = 'summer'; // Track current season
    let animals = []; // Store animal references
    let farmers = []; // Store farmer references
    let mousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // Default mouse position
    let isModalOpen = false; // Track if a modal is open
    // Store the Bootstrap modal instance
    let imagePreviewModalInstance = null;

    // Enhanced British Countryside Theme Setup
    function setupCountrysideTheme() {
        // Create the countryside container
        const countrysideContainer = document.createElement('div');
        countrysideContainer.className = 'countryside-container';

        // Create sky
        const sky = document.createElement('div');
        sky.className = 'sky';
        sky.id = 'sky';
        countrysideContainer.appendChild(sky);

        // Create clouds container
        const cloudsContainer = document.createElement('div');
        cloudsContainer.className = 'clouds';
        cloudsContainer.id = 'clouds';

        // Add clouds of different sizes and speeds
        for (let i = 0; i < 6; i++) {
            const cloud = document.createElement('div');
            cloud.className = `cloud cloud${i+1}`;
            cloud.style.top = `${40 + Math.random() * 150}px`;
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.animationDuration = `${80 + Math.random() * 40}s`;
            cloud.style.opacity = '0.9';
            cloudsContainer.appendChild(cloud);
        }

        countrysideContainer.appendChild(cloudsContainer);

        // Create sun with rays
        const sun = document.createElement('div');
        sun.className = 'sun';
        sun.id = 'sun';

        const sunRays = document.createElement('div');
        sunRays.className = 'sun-rays';

        // Add sun rays
        for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            ray.className = 'sun-ray';
            ray.style.transform = `rotate(${i * 30}deg)`;
            sunRays.appendChild(ray);
        }

        sun.appendChild(sunRays);
        countrysideContainer.appendChild(sun);

        // Create hills
        const hills = document.createElement('div');
        hills.className = 'hills';

        const hill1 = document.createElement('div');
        hill1.className = 'hill hill1';
        hill1.id = 'hill1';
        hills.appendChild(hill1);

        const hill2 = document.createElement('div');
        hill2.className = 'hill hill2';
        hill2.id = 'hill2';
        hills.appendChild(hill2);

        const hill3 = document.createElement('div');
        hill3.className = 'hill hill3';
        hill3.id = 'hill3';
        hills.appendChild(hill3);

        // Create stone wall
        const stoneWall = document.createElement('div');
        stoneWall.className = 'stone-wall';
        hills.appendChild(stoneWall);

        // Create field
        const field = document.createElement('div');
        field.className = 'field';
        field.id = 'field';
        hills.appendChild(field);

        countrysideContainer.appendChild(hills);

        // Create cottage
        const cottage = document.createElement('div');
        cottage.className = 'cottage';

        const cottageBody = document.createElement('div');
        cottageBody.className = 'cottage-body';
        cottage.appendChild(cottageBody);

        const cottageRoof = document.createElement('div');
        cottageRoof.className = 'cottage-roof';
        cottage.appendChild(cottageRoof);

        const cottageDoor = document.createElement('div');
        cottageDoor.className = 'cottage-door';
        cottage.appendChild(cottageDoor);

        const cottageWindow1 = document.createElement('div');
        cottageWindow1.className = 'cottage-window cottage-window1';
        cottage.appendChild(cottageWindow1);

        const cottageWindow2 = document.createElement('div');
        cottageWindow2.className = 'cottage-window cottage-window2';
        cottage.appendChild(cottageWindow2);

        const cottageChimney = document.createElement('div');
        cottageChimney.className = 'cottage-chimney';
        cottageChimney.id = 'cottage-chimney';
        cottage.appendChild(cottageChimney);

        countrysideContainer.appendChild(cottage);

        // Create animal container
        const animalContainer = document.createElement('div');
        animalContainer.className = 'animal-container';
        animalContainer.id = 'animal-container';

        // Add sheep
        for (let i = 0; i < 5; i++) {
            const sheep = createSheep();
            const initialX = 50 + Math.random() * (window.innerWidth - 100);
            sheep.style.left = `${initialX}px`;
            sheep.dataset.speed = 0.2 + Math.random() * 0.3; // Slower speed
            sheep.dataset.x = initialX;
            sheep.dataset.targetX = initialX;
            animalContainer.appendChild(sheep);
            animals.push({
                element: sheep,
                type: 'sheep',
                speed: parseFloat(sheep.dataset.speed),
                x: initialX,
                targetX: initialX,
                direction: 1,
                moving: false
            });
        }

        // Add cows
        for (let i = 0; i < 2; i++) {
            const cow = createCow();
            const initialX = 200 + (Math.random() * (window.innerWidth - 500));
            cow.style.left = `${initialX}px`;
            animalContainer.appendChild(cow);
            animals.push({
                element: cow,
                type: 'cow',
                x: initialX,
                direction: 1
            });
        }

        countrysideContainer.appendChild(animalContainer);

        // Create farmer container
        const farmerContainer = document.createElement('div');
        farmerContainer.className = 'farmer-container';
        farmerContainer.id = 'farmer-container';

        // Add farmers (hidden initially)
        for (let i = 0; i < 3; i++) {
            const farmer = createFarmer();
            const initialX = 150 + (i * 200) + (Math.random() * 50);
            farmer.style.left = `${initialX}px`;
            farmer.style.display = 'none'; // Hidden by default
            farmerContainer.appendChild(farmer);
            farmers.push({
                element: farmer,
                x: initialX,
                state: 'idle',
                direction: i % 2 === 0 ? 1 : -1
            });
        }

        countrysideContainer.appendChild(farmerContainer);

        // Add butterflies
        for (let i = 0; i < 3; i++) {
            const butterfly = createButterfly();
            butterfly.style.left = `${50 + (Math.random() * (window.innerWidth - 100))}px`;
            butterfly.style.top = `${100 + (Math.random() * 200)}px`;
            butterfly.style.animationDelay = `${Math.random() * 5}s`;
            countrysideContainer.appendChild(butterfly);
        }

        // Add hedgehog
        const hedgehog = createHedgehog();
        countrysideContainer.appendChild(hedgehog);

        // Add rainbow
        const rainbow = document.createElement('div');
        rainbow.className = 'rainbow';
        rainbow.id = 'rainbow';

        for (let i = 1; i <= 8; i++) {
            const layer = document.createElement('div');
            layer.className = `rainbow-layer rainbow-layer${i}`;
            rainbow.appendChild(layer);
        }

        countrysideContainer.appendChild(rainbow);

        // Add the countryside container to the body
        document.body.appendChild(countrysideContainer);
        document.body.appendChild(farmerContainer);
        document.body.appendChild(animalContainer);

        // Initialize interactive behaviors
        initializeCountrysideInteractions();

        // Start with summer season
        setSeason('summer');

        // Start animation loop
        requestAnimationFrame(animateScene);
    }

    // Create sheep element
    function createSheep() {
        const sheep = document.createElement('div');
        sheep.className = 'sheep';

        const sheepBody = document.createElement('div');
        sheepBody.className = 'sheep-body';
        sheep.appendChild(sheepBody);

        const sheepHead = document.createElement('div');
        sheepHead.className = 'sheep-head';

        const sheepEar1 = document.createElement('div');
        sheepEar1.className = 'sheep-ear sheep-ear1';
        sheepHead.appendChild(sheepEar1);

        const sheepEar2 = document.createElement('div');
        sheepEar2.className = 'sheep-ear sheep-ear2';
        sheepHead.appendChild(sheepEar2);

        const sheepEye = document.createElement('div');
        sheepEye.className = 'sheep-eye';
        sheepHead.appendChild(sheepEye);

        sheep.appendChild(sheepHead);

        const sheepLeg1 = document.createElement('div');
        sheepLeg1.className = 'sheep-leg sheep-leg1';
        sheep.appendChild(sheepLeg1);

        const sheepLeg2 = document.createElement('div');
        sheepLeg2.className = 'sheep-leg sheep-leg2';
        sheep.appendChild(sheepLeg2);

        const sheepLeg3 = document.createElement('div');
        sheepLeg3.className = 'sheep-leg sheep-leg3';
        sheep.appendChild(sheepLeg3);

        const sheepLeg4 = document.createElement('div');
        sheepLeg4.className = 'sheep-leg sheep-leg4';
        sheep.appendChild(sheepLeg4);

        return sheep;
    }

    // Create cow element
    function createCow() {
        const cow = document.createElement('div');
        cow.className = 'cow';

        const cowBody = document.createElement('div');
        cowBody.className = 'cow-body';

        const cowSpot1 = document.createElement('div');
        cowSpot1.className = 'cow-spot cow-spot1';
        cowBody.appendChild(cowSpot1);

        const cowSpot2 = document.createElement('div');
        cowSpot2.className = 'cow-spot cow-spot2';
        cowBody.appendChild(cowSpot2);

        cow.appendChild(cowBody);

        const cowHead = document.createElement('div');
        cowHead.className = 'cow-head';

        const cowEar1 = document.createElement('div');
        cowEar1.className = 'cow-ear cow-ear1';
        cowHead.appendChild(cowEar1);

        const cowEar2 = document.createElement('div');
        cowEar2.className = 'cow-ear cow-ear2';
        cowHead.appendChild(cowEar2);

        const cowEye = document.createElement('div');
        cowEye.className = 'cow-eye';
        cowHead.appendChild(cowEye);

        const cowNose = document.createElement('div');
        cowNose.className = 'cow-nose';
        cowHead.appendChild(cowNose);

        cow.appendChild(cowHead);

        const cowLeg1 = document.createElement('div');
        cowLeg1.className = 'cow-leg cow-leg1';
        cow.appendChild(cowLeg1);

        const cowLeg2 = document.createElement('div');
        cowLeg2.className = 'cow-leg cow-leg2';
        cow.appendChild(cowLeg2);

        const cowLeg3 = document.createElement('div');
        cowLeg3.className = 'cow-leg cow-leg3';
        cow.appendChild(cowLeg3);

        const cowLeg4 = document.createElement('div');
        cowLeg4.className = 'cow-leg cow-leg4';
        cow.appendChild(cowLeg4);

        return cow;
    }

    // Create farmer element
    function createFarmer() {
        const farmer = document.createElement('div');
        farmer.className = 'farmer';

        const farmerBody = document.createElement('div');
        farmerBody.className = 'farmer-body';
        farmer.appendChild(farmerBody);

        const farmerHead = document.createElement('div');
        farmerHead.className = 'farmer-head';
        farmer.appendChild(farmerHead);

        const farmerHat = document.createElement('div');
        farmerHat.className = 'farmer-hat';
        farmer.appendChild(farmerHat);

        const farmerArm1 = document.createElement('div');
        farmerArm1.className = 'farmer-arm farmer-arm1';
        farmer.appendChild(farmerArm1);

        const farmerArm2 = document.createElement('div');
        farmerArm2.className = 'farmer-arm farmer-arm2';
        farmer.appendChild(farmerArm2);

        const farmerLeg1 = document.createElement('div');
        farmerLeg1.className = 'farmer-leg farmer-leg1';
        farmer.appendChild(farmerLeg1);

        const farmerLeg2 = document.createElement('div');
        farmerLeg2.className = 'farmer-leg farmer-leg2';
        farmer.appendChild(farmerLeg2);

        // Create farmer tool (changes with season)
        const farmerTool = document.createElement('div');
        farmerTool.className = 'farmer-tool';
        farmer.appendChild(farmerTool);

        return farmer;
    }

    // Create butterfly element
    function createButterfly() {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';

        const butterflyWingLeft = document.createElement('div');
        butterflyWingLeft.className = 'butterfly-wing butterfly-wing-left';
        butterfly.appendChild(butterflyWingLeft);

        const butterflyWingRight = document.createElement('div');
        butterflyWingRight.className = 'butterfly-wing butterfly-wing-right';
        butterfly.appendChild(butterflyWingRight);

        const butterflyBody = document.createElement('div');
        butterflyBody.className = 'butterfly-body';
        butterfly.appendChild(butterflyBody);

        return butterfly;
    }

    // Create hedgehog element
    function createHedgehog() {
        const hedgehog = document.createElement('div');
        hedgehog.className = 'hedgehog';
        hedgehog.id = 'hedgehog';
        hedgehog.style.left = '150px';

        const hedgehogBody = document.createElement('div');
        hedgehogBody.className = 'hedgehog-body';
        hedgehog.appendChild(hedgehogBody);

        const hedgehogFace = document.createElement('div');
        hedgehogFace.className = 'hedgehog-face';

        const hedgehogEye = document.createElement('div');
        hedgehogEye.className = 'hedgehog-eye';
        hedgehogFace.appendChild(hedgehogEye);

        const hedgehogNose = document.createElement('div');
        hedgehogNose.className = 'hedgehog-nose';
        hedgehogFace.appendChild(hedgehogNose);

        hedgehog.appendChild(hedgehogFace);

        const hedgehogSpikes = document.createElement('div');
        hedgehogSpikes.className = 'hedgehog-spikes';

        // Add spikes
        for (let i = 0; i < 20; i++) {
            const spike = document.createElement('div');
            spike.className = 'hedgehog-spike';
            spike.style.transform = `rotate(${i * 18}deg)`;
            spike.style.left = `${10 + Math.random() * 10}px`;
            spike.style.top = `${Math.random() * 15}px`;
            hedgehogSpikes.appendChild(spike);
        }

        hedgehog.appendChild(hedgehogSpikes);

        return hedgehog;
    }

    // Main animation loop
function animateScene() {
    // Skip all updates if modal is open
    if (isModalOpen) {
        // Just keep the animation loop alive without doing any work
        requestAnimationFrame(animateScene);
        return;
    }

    // Update animal positions
    updateAnimals();

    // Update farmers based on season
    updateFarmers();

    // Add chance for sheep to speak
    triggerRandomSheepSpeech();

    // Request next frame
    requestAnimationFrame(animateScene);
}

    // Update animal positions with smoother movement
    function updateAnimals() {
        animals.forEach(animal => {
            if (animal.type === 'sheep') {
                // Calculate distance to mouse
                const animalRect = animal.element.getBoundingClientRect();
                const animalCenterX = animalRect.left + animalRect.width / 2;
                const distanceX = mousePosition.x - animalCenterX;

                // Only react if mouse is close
                if (Math.abs(distanceX) < 150) {
                    // Set target position - move away from mouse with some randomness
                    animal.targetX = animal.x - (Math.sign(distanceX) * (100 + Math.random() * 50));
                    animal.moving = true;

                    // Set direction based on movement
                    animal.direction = distanceX > 0 ? -1 : 1;
                } else if (Math.random() < 0.01 && !animal.moving) {
                    // Random movement occasionally
                    animal.targetX = animal.x + (Math.random() - 0.5) * 100;
                    animal.direction = animal.targetX > animal.x ? 1 : -1;
                    animal.moving = true;
                }

                // If sheep is moving, animate toward target position
                if (animal.moving) {
                    // Calculate distance to target
                    const distanceToTarget = animal.targetX - animal.x;

                    // If we're close to target, stop moving
                    if (Math.abs(distanceToTarget) < 5) {
                        animal.moving = false;
                    } else {
                        // Move toward target with easing
                        animal.x += distanceToTarget * 0.05; // Smoother, slower movement

                        // Keep sheep within boundaries
                        if (animal.x < 10) animal.x = 10;
                        if (animal.x > window.innerWidth - 60) animal.x = window.innerWidth - 60;

                        // Update position and orientation
                        animal.element.style.left = `${animal.x}px`;
                        animal.element.style.transform = `scaleX(${animal.direction})`;

                        // Add leg animation class when moving
                        animal.element.classList.add('walking');
                    }
                } else {
                    // Remove walking animation when stopped
                    animal.element.classList.remove('walking');
                }
            } else if (animal.type === 'cow') {
                // Cows just look at the mouse
                const cowRect = animal.element.getBoundingClientRect();
                const cowX = cowRect.left + cowRect.width / 2;
                animal.direction = mousePosition.x < cowX ? 1 : -1;
                animal.element.style.transform = `scaleX(${animal.direction})`;
            }
        });
    }

    // Update farmers based on season
    function updateFarmers() {
        farmers.forEach((farmer, index) => {
            const farmerElement = farmer.element;

            if (currentSeason === 'summer' || currentSeason === 'spring') {
                // Show farmers in spring/summer
                farmerElement.style.display = 'block';

                // Animate farmers working
                if (Math.random() < 0.005) {
                    // Occasionally change direction
                    farmer.direction *= -1;
                    farmerElement.style.transform = `scaleX(${farmer.direction})`;
                }

                // Move farmers slightly
                if (Math.random() < 0.01) {
                    const newX = farmer.x + (Math.random() - 0.5) * 40;
                    farmer.x = Math.max(50, Math.min(window.innerWidth - 100, newX));
                    farmerElement.style.left = `${farmer.x}px`;
                }

                // Working animation
                farmerElement.classList.add('working');

                // Different tools for different seasons
                if (currentSeason === 'spring') {
                    farmerElement.classList.add('planting');
                    farmerElement.classList.remove('harvesting');
                } else {
                    farmerElement.classList.add('tending');
                    farmerElement.classList.remove('planting');
                }
            } else if (currentSeason === 'autumn') {
                // Show farmers harvesting in autumn
                farmerElement.style.display = 'block';
                farmerElement.classList.add('working');
                farmerElement.classList.add('harvesting');
                farmerElement.classList.remove('planting');
                farmerElement.classList.remove('tending');

                // More active movement during harvest
                if (Math.random() < 0.02) {
                    const newX = farmer.x + (Math.random() - 0.5) * 60;
                    farmer.x = Math.max(50, Math.min(window.innerWidth - 100, newX));
                    farmerElement.style.left = `${farmer.x}px`;

                    // Occasionally change direction
                    if (Math.random() < 0.3) {
                        farmer.direction *= -1;
                        farmerElement.style.transform = `scaleX(${farmer.direction})`;
                    }
                }
            } else if (currentSeason === 'winter') {
                // Hide farmers in winter - they're in the cottage
                farmerElement.style.display = 'none';
                farmerElement.classList.remove('working');
            }
        });
    }

    // Set season with visual changes
    function setSeason(season) {
        const sky = document.getElementById('sky');
        const field = document.getElementById('field');
        const hill1 = document.getElementById('hill1');
        const hill2 = document.getElementById('hill2');
        const hill3 = document.getElementById('hill3');
        const cottage = document.querySelector('.cottage');
        const chimney = document.getElementById('cottage-chimney');
        const clouds = document.getElementById('clouds');
        const sun = document.getElementById('sun');
        const hedgehog = document.getElementById('hedgehog');

        // Store the current season
        currentSeason = season;

        // Clear any existing seasonal classes
        document.body.classList.remove('season-summer', 'season-autumn', 'season-winter', 'season-spring');

        switch(season) {
            case 'summer':
                // Bright summer day
                sky.style.background = 'linear-gradient(to bottom, #6EB9E5, #87CEEB)';
                field.style.backgroundColor = '#8BC34A';
                hill1.style.background = 'linear-gradient(to bottom, #7CB342, #558B2F)';
                hill2.style.background = 'linear-gradient(to bottom, #8BC34A, #689F38)';
                hill3.style.background = 'linear-gradient(to bottom, #AED581, #7CB342)';

                // Fewer clouds in summer
                clouds.style.opacity = '0.6';
                Array.from(clouds.children).forEach(cloud => {
                    cloud.style.animationDuration = `${120 + Math.random() * 60}s`;
                });

                // Bright sun
                sun.style.opacity = '1';
                sun.style.boxShadow = '0 0 50px 10px rgba(255, 215, 0, 0.7)';

                // Show butterflies
                document.querySelectorAll('.butterfly').forEach(b => {
                    b.style.display = 'block';
                });

                // Hedgehog is active
                hedgehog.style.display = 'block';

                document.body.classList.add('season-summer');
                break;

            case 'autumn':
                // Autumn colors
                sky.style.background = 'linear-gradient(to bottom, #94C0DA, #B0C4DE)';
                field.style.backgroundColor = '#D4A76A';
                hill1.style.background = 'linear-gradient(to bottom, #D4A76A, #B5651D)';
                hill2.style.background = 'linear-gradient(to bottom, #E3A857, #CB7B07)';
                hill3.style.background = 'linear-gradient(to bottom, #FFA726, #F57F17)';

                // More clouds in autumn
                clouds.style.opacity = '0.8';
                Array.from(clouds.children).forEach(cloud => {
                    cloud.style.animationDuration = `${100 + Math.random() * 40}s`;
                });

                // Less bright sun
                sun.style.opacity = '0.8';
                sun.style.boxShadow = '0 0 30px 5px rgba(255, 215, 0, 0.5)';

                // Hide butterflies
                document.querySelectorAll('.butterfly').forEach(b => {
                    b.style.display = 'none';
                });

                // Hedgehog is active
                hedgehog.style.display = 'block';

                document.body.classList.add('season-autumn');
                break;

            case 'winter':
                // Winter look
                sky.style.background = 'linear-gradient(to bottom, #B0C4DE, #CFD8DC)';
                field.style.backgroundColor = '#ECEFF1';
                hill1.style.background = 'linear-gradient(to bottom, #90A4AE, #607D8B)';
                hill2.style.background = 'linear-gradient(to bottom, #BCAAA4, #8D6E63)';
                hill3.style.background = 'linear-gradient(to bottom, #CFD8DC, #B0BEC5)';

                // Many dark clouds in winter
                clouds.style.opacity = '1';
                Array.from(clouds.children).forEach(cloud => {
                    cloud.style.opacity = '0.9';
                    cloud.style.background = '#B0BEC5';
                    cloud.style.animationDuration = `${60 + Math.random() * 30}s`;
                });

                // Dim sun in winter
                sun.style.opacity = '0.6';
                sun.style.boxShadow = '0 0 20px 5px rgba(255, 215, 0, 0.3)';

                // Hide butterflies
                document.querySelectorAll('.butterfly').forEach(b => {
                    b.style.display = 'none';
                });

                // Hedgehog hibernates in winter
                hedgehog.style.display = 'none';

                // More chimney smoke in winter
                createChimneySmoke(true);

                document.body.classList.add('season-winter');
                break;

            case 'spring':
                // Spring colors
                sky.style.background = 'linear-gradient(to bottom, #81D4FA, #B3E5FC)';
                field.style.backgroundColor = '#C5E1A5';
                hill1.style.background = 'linear-gradient(to bottom, #9CCC65, #7CB342)';
                hill2.style.background = 'linear-gradient(to bottom, #AED581, #8BC34A)';
                hill3.style.background = 'linear-gradient(to bottom, #DCEDC8, #AED581)';

                // Moderate clouds in spring
                clouds.style.opacity = '0.7';
                Array.from(clouds.children).forEach(cloud => {
                    cloud.style.opacity = '0.7';
                    cloud.style.background = 'white';
                    cloud.style.animationDuration = `${80 + Math.random() * 40}s`;
                });

                // Brightening sun in spring
                sun.style.opacity = '0.9';
                sun.style.boxShadow = '0 0 40px 8px rgba(255, 215, 0, 0.6)';

                // Show butterflies
                document.querySelectorAll('.butterfly').forEach(b => {
                    b.style.display = 'block';
                });

                // Hedgehog is active in spring
                hedgehog.style.display = 'block';

                document.body.classList.add('season-spring');
                break;
        }
    }

    // Create chimney smoke with variable intensity
    function createChimneySmoke(intense = false) {
        const chimney = document.getElementById('cottage-chimney');
        if (!chimney) return;

        const intensity = intense ? 0.3 : 0.1; // More smoke in winter

        if (Math.random() > intensity) return;

        const smoke = document.createElement('div');
        smoke.className = 'chimney-smoke';
        smoke.style.left = '6px';
        smoke.style.bottom = '25px';

        // More smoke in winter
        if (intense) {
            smoke.style.width = '15px';
            smoke.style.height = '15px';
            smoke.style.opacity = '0.9';
        }

        // Animate smoke
        const animationDuration = intense ? 3000 : 2000;
        smoke.animate([
            { transform: 'translateY(0) scale(1)', opacity: intense ? 0.9 : 0.8 },
            { transform: 'translateY(-80px) translateX(20px) scale(2)', opacity: 0 }
        ], {
            duration: animationDuration,
            easing: 'ease-out'
        });

        // Remove smoke after animation
        setTimeout(() => {
            smoke.remove();
        }, animationDuration);

        chimney.appendChild(smoke);
    }

    // Create light rain
    function createLightRain() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const raindrop = document.createElement('div');
                raindrop.className = 'raindrop';
                raindrop.style.left = `${Math.random() * window.innerWidth}px`;
                document.body.appendChild(raindrop);

                // Remove raindrop after animation
                setTimeout(() => {
                    raindrop.remove();
                }, 1500);
            }, i * 100);
        }
    }

    // Create snow
    function createSnow() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.style.left = `${Math.random() * window.innerWidth}px`;
                snowflake.style.top = '-10px';

                // Animate snowflake
                snowflake.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
                    { transform: `translateY(${window.innerHeight}px) translateX(${(Math.random() - 0.5) * 200}px) rotate(360deg)`, opacity: 0 }
                ], {
                    duration: 5000 + Math.random() * 5000,
                    easing: 'linear'
                });

                // Remove snowflake after animation
                setTimeout(() => {
                    snowflake.remove();
                }, 10000);

                document.body.appendChild(snowflake);
            }, i * 200);
        }
    }

    // Create a function to generate random sheep speech
function generateSheepSpeech() {
    const speeches = [
        "BAAAAA!",
        "MEEEEEH!",
        "BAAAAH!",
        "BAA BAA!",
        "MEEEH!",
        "BAAAAA?",
        "BAA!",
        "BLEAT!",
        "*nibbles grass*",
        "BAAA-AAAA!"
    ];

    return speeches[Math.floor(Math.random() * speeches.length)];
}

// Function to create and show a speech bubble
function showSheepSpeechBubble(sheep) {
    // Don't add a new bubble if one is already visible
    let bubble = document.querySelector(`.sheep-speech-bubble[data-sheep-id="${sheep.id}"]`);
    if (bubble && bubble.classList.contains('visible')) {
        return;
    }

    // If no bubble exists, create one
    if (!bubble) {
        if (!sheep.id) {
            sheep.id = 'sheep-' + Math.random().toString(36).substr(2, 9);
        }
        
        bubble = document.createElement('div');
        bubble.className = 'sheep-speech-bubble';
        bubble.setAttribute('data-sheep-id', sheep.id);
        
        document.body.appendChild(bubble);
        
        const sheepRect = sheep.getBoundingClientRect();
        bubble.style.left = (sheepRect.left + sheepRect.width/2 - 40) + 'px';
        bubble.style.top = (sheepRect.top - 30) + 'px';
    }

    // Set bubble text and make it visible
    bubble.textContent = generateSheepSpeech();
    bubble.classList.add('visible');

    // Hide bubble after a random time (2-5 seconds)
    const displayTime = 2000 + Math.random() * 3000;
    setTimeout(() => {
        bubble.classList.remove('visible');
        // Remove element after transition
        setTimeout(() => {
            if (bubble && bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 300);
    }, displayTime);
}

// Function to randomly trigger sheep talking
function triggerRandomSheepSpeech() {
    // Small chance of a sheep speaking during any animation frame
    if (Math.random() < 0.01) { // 0.1% chance per frame
        const sheepElements = document.querySelectorAll('.sheep');
        if (sheepElements.length > 0) {
            // Pick a random sheep
            const randomSheep = sheepElements[Math.floor(Math.random() * sheepElements.length)];
            showSheepSpeechBubble(randomSheep);
        }
    }
}

    // Initialize countryside interactive behaviors
    function initializeCountrysideInteractions() {
        // Get the sun and rainbow elements
        const sun = document.getElementById('sun');
        const rainbow = document.getElementById('rainbow');

        if (!sun || !rainbow) {
            console.error('Sun or rainbow element not found!');
            return;
        }

        // Track mouse position for animal movement
        document.addEventListener('mousemove', (e) => {
            mousePosition = { x: e.clientX, y: e.clientY };
        });

        // FIX: Fix for rainbow appearing after clicking sun
        // Make sure sun click event works by adding pointer-events: auto to the sun element in CSS
        sun.addEventListener('click', () => {
            console.log('Sun clicked'); // Debug
            rainbow.classList.add('rainbow-active');

            // Create light rain
            createLightRain();

            // Hide rainbow after 10 seconds
            setTimeout(() => {
                rainbow.classList.remove('rainbow-active');
            }, 10000);
        });

        // Regular chimney smoke
        setInterval(() => {
            createChimneySmoke(currentSeason === 'winter');
        }, 1000);

        // Seasons change - every 30 seconds
        setInterval(() => {
            const seasons = ['summer', 'autumn', 'winter', 'spring'];
            const currentIndex = seasons.indexOf(currentSeason);
            const nextIndex = (currentIndex + 1) % seasons.length;
            setSeason(seasons[nextIndex]);

            // Create snow during winter transition
            if (seasons[nextIndex] === 'winter') {
                createSnow();
            }
        }, 30000);

        // Start with a bit of weather appropriate to the season
        if (currentSeason === 'winter') {
            createSnow();
        }
    }

    // Initialize subject dropdown on page load
    initSubjectDropdown();

    // Initialize subject dropdown functionality
    function initSubjectDropdown() {
        if (!subjectInput || !subjectDropdown) return;

        const dropdownItems = subjectDropdown.querySelectorAll('.dropdown-item');

        // Filter dropdown options as user types
        subjectInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase();
            let hasVisibleItems = false;

            dropdownItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchText)) {
                    item.parentElement.style.display = '';
                    hasVisibleItems = true;
                } else {
                    item.parentElement.style.display = 'none';
                }
            });

            // Show dropdown if there are visible items
            if (hasVisibleItems && searchText.length > 0) {
                if (!subjectDropdown.classList.contains('show')) {
                    const dropdown = new bootstrap.Dropdown(subjectInput);
                    dropdown.show();
                }
            }
        });

        // Handle dropdown item selection
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                subjectInput.value = this.textContent;

                // Hide dropdown
                const dropdownInstance = bootstrap.Dropdown.getInstance(subjectInput);
                if (dropdownInstance) {
                    dropdownInstance.hide();
                }
            });
        });
    }

// Function to show image preview modal
function showImagePreview(imageUrl, filename) {
    console.log('Opening preview modal with image:', imageUrl);

    if (!imageUrl) {
        console.error('Image URL is undefined or empty');
        return;
    }

    // Get the modal element
    const modalElement = document.getElementById('imagePreviewModal');
    if (!modalElement) {
        console.error('Modal element not found!');
        return;
    }

    // Get or create the modal body
    const modalBody = modalElement.querySelector('.modal-body');
    if (!modalBody) {
        console.error('Modal body not found!');
        return;
    }

    // Update modal title
    const modalTitle = modalElement.querySelector('.modal-title');
    if (modalTitle && filename) {
        modalTitle.textContent = filename;
    }

    // Clear the modal body and create a fresh image
    modalBody.innerHTML = '';
    const imageElement = document.createElement('img');
    imageElement.id = 'enlargedImage';
    imageElement.className = 'img-fluid';
    imageElement.alt = filename || 'Image Preview';
    imageElement.src = imageUrl;
    modalBody.appendChild(imageElement);

    // Initialize the modal instance if it doesn't exist yet
    if (!imagePreviewModalInstance) {
        try {
            imagePreviewModalInstance = new bootstrap.Modal(modalElement);
        } catch (error) {
            console.error('Error initializing modal:', error);
            return;
        }
    }

    // Set flag to indicate modal is open
    isModalOpen = true;

    // Show the modal
    try {
        imagePreviewModalInstance.show();
    } catch (error) {
        console.error('Error showing modal:', error);
        isModalOpen = false;
        return;
    }

    // Add event listener for when modal is hidden
    modalElement.addEventListener('hidden.bs.modal', () => {
        isModalOpen = false;
    }, { once: true });
}

    // Helper functions
    function showLoading(message) {
        loadingText.textContent = message || 'Processing...';
        loadingOverlay.style.display = 'flex';
    }

    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }

    function showValidationErrors(errors) {
        validationErrorsList.innerHTML = '';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            validationErrorsList.appendChild(li);
        });
        validationMessages.style.display = 'block';

        // Scroll to validation messages
        validationMessages.scrollIntoView({ behavior: 'smooth' });
    }

    function hideValidationErrors() {
        validationMessages.style.display = 'none';
    }

    function toggleInputType(type) {
        currentInputType = type;

        if (type === 'image') {
            imageUploadSection.style.display = 'block';
            textInputSection.style.display = 'none';
        } else {
            imageUploadSection.style.display = 'none';
            textInputSection.style.display = 'block';

            // Hide image-specific containers
            arrangeContainer.style.display = 'none';
            previewContainer.style.display = 'none';
        }
    }

    // Preview function for stitching images
    async function updatePreview() {
        if (sortableList.children.length === 0) {
            alert('Please add at least one image to stitch');
            return;
        }

        showLoading('Generating preview...');

        const fileOrder = Array.from(sortableList.children).map(item => item.dataset.filename);

        try {
            const response = await fetch('/stitch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file_order: fileOrder })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Show preview
            stitchedPreview.src = data.stitched_image_url;
            previewContainer.style.display = 'block';

            // Smooth scroll to preview section
            previewContainer.scrollIntoView({ behavior: 'smooth' });

            hideLoading();
        } catch (error) {
            hideLoading();
            alert(`Error generating preview: ${error.message}`);
        }
    }

    // Initialize SortableJS
    function initSortable() {
        sortable = new Sortable(sortableList, {
            animation: 150,
            handle: '.handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            onEnd: updatePreview
        });
    }

    function populateSortableList(files) {
        sortableList.innerHTML = '';

        files.forEach(file => {
            const li = document.createElement('div');
            li.className = 'sortable-item';
            li.dataset.filename = file.name;
            li.innerHTML = `
                <i class="fas fa-grip-lines handle"></i>
                <img src="${file.url}" alt="${file.name}" class="clickable-image">
                <span class="filename">${file.name}</span>
                <button type="button" class="remove-btn">
                    <i class="fas fa-times"></i>
                </button>
            `;

            const removeBtn = li.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => {
                li.remove();
                updatePreview();
            });

            // Add click event for image preview
            const imgElement = li.querySelector('.clickable-image');
            imgElement.addEventListener('click', (e) => {
                e.stopPropagation();
                showImagePreview(file.url, file.name);
            });

            sortableList.appendChild(li);
        });

        initSortable();
    }

    function handleFiles(files) {
        const fileArray = Array.from(files);

        // Don't clear previously uploaded files if they exist
        if (!uploadedFiles) {
            uploadedFiles = [];
        }

        // Display preview
        fileArray.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageUrl = e.target.result;

                    // Create a unique ID for the file for easier removal
                    const fileId = `file-${Date.now()}-${index}`;
                    file.id = fileId;

                    const div = document.createElement('div');
                    div.className = 'col-6 col-md-4 col-lg-3';
                    div.dataset.fileId = fileId;
                    div.innerHTML = `
                        <div class="card">
                            <button type="button" class="remove-image-btn" data-file-id="${fileId}">
                                <i class="fas fa-times"></i>
                            </button>
                            <img src="${imageUrl}" class="card-img-top clickable-image" alt="${file.name}" style="height: 120px; object-fit: cover;">
                            <div class="card-body p-2">
                                <p class="card-text small text-truncate">${file.name}</p>
                            </div>
                        </div>
                    `;

                    // Add click event for image preview
                    const imgElement = div.querySelector('.clickable-image');
                    imgElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showImagePreview(imageUrl, file.name);
                    });

                    // Add click event for remove button
                    const removeBtn = div.querySelector('.remove-image-btn');
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Remove from uploadedFiles array
                        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
                        // Remove the preview element
                        div.remove();
                        console.log(`Removed file. Remaining files: ${uploadedFiles.length}`);
                    });

                    uploadPreview.appendChild(div);
                };
                reader.readAsDataURL(file);
                uploadedFiles.push(file);
            }
        });

        console.log(`Processed ${fileArray.length} files. Total files: ${uploadedFiles.length}`);
    }

// This function updates the render process to automatically name new levels
// and add drag-and-drop functionality for reordering levels
function renderMarkScheme(data) {
    markSchemeContent.innerHTML = '';

    // Check if data exists and has the required structure
    if (!data || !data.mark_scheme) {
        markSchemeContent.innerHTML = '<div class="alert alert-danger">Invalid mark scheme data</div>';
        return;
    }

    // Set form fields if available
    if (data.subject) subjectInput.value = data.subject;
    if (data.title) titleInput.value = data.title;
    if (data.qualification_level) qualificationLevelSelect.value = data.qualification_level;
    if (data.exam_board) examBoardSelect.value = data.exam_board;

    // Store top-level guidance and indicative content
    const globalGuidance = data.guidance;
    const globalIndicativeContent = data.indicative_content;

    // Copy top-level guidance and indicative content to assessment objectives if they don't have their own
    if (data.mark_scheme && Array.isArray(data.mark_scheme)) {
        data.mark_scheme.forEach(obj => {
            // Copy global guidance to the objective if not already set
            if (!obj.guidance && globalGuidance) {
                obj.guidance = globalGuidance;
            }

            // Copy global indicative content to the objective if not already set
            if (!obj.indicative_content && globalIndicativeContent) {
                obj.indicative_content = globalIndicativeContent;
            }
        });
    }

    // Render each objective
    data.mark_scheme.forEach((obj, objIndex) => {
        const objectiveDiv = document.createElement('div');
        objectiveDiv.className = 'mark-scheme-objective';
        objectiveDiv.dataset.objIndex = objIndex;

        // Objective header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'objective-header';
        headerDiv.innerHTML = `
            <div class="objective-title-area">
                <div contenteditable="true" class="editable-field objective-name">
                    ${obj.objective || 'Unnamed Objective'}
                </div>
                ${obj.assessment_objective_id ? `<div class="assessment-objective-id">ID: ${obj.assessment_objective_id}</div>` : ''}
            </div>
            <div class="objective-controls">
                <div class="objective-weight">Weight: <span contenteditable="true" class="editable-field">${obj.weight !== undefined && obj.weight !== null ? obj.weight : ''}</span></div>
                <button class="btn btn-sm btn-primary balance-marks-btn me-2">
                    <i class="fas fa-balance-scale me-1"></i>Balance
                </button>
                <button class="btn btn-sm btn-danger delete-objective-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        objectiveDiv.appendChild(headerDiv);

        // Add event listener for the balance button
        const balanceBtn = headerDiv.querySelector('.balance-marks-btn');
        balanceBtn.addEventListener('click', () => {
            // Get all levels for this objective
            const levelElements = objectiveDiv.querySelectorAll('.mark-scheme-level');
            const levels = Array.from(levelElements).map(levelElement => {
                const levelIndex = parseInt(levelElement.dataset.levelIndex);
                return markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex];
            });

            // Apply balancing to the levels
            const balancedLevels = balanceMarkSchemeMarks([...levels]);

            // Update mark scheme data
            markSchemeData.mark_scheme[objIndex].mark_scheme = balancedLevels;

            // Update UI with balanced values
            levelElements.forEach(levelElement => {
                const levelIndex = parseInt(levelElement.dataset.levelIndex);
                const level = balancedLevels[levelIndex];

                const lowerMarkElement = levelElement.querySelector('.lower-mark');
                const upperMarkElement = levelElement.querySelector('.upper-mark');

                if (lowerMarkElement && upperMarkElement) {
                    lowerMarkElement.textContent = level.lower_mark_bound;
                    upperMarkElement.textContent = level.upper_mark_bound;
                }
            });

            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'alert alert-success balance-notification';
            notification.innerHTML = `<i class="fas fa-check-circle me-2"></i>Mark scheme balanced successfully!`;
            notification.style.position = 'absolute';
            notification.style.top = '10px';
            notification.style.right = '10px';
            notification.style.zIndex = '1000';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';

            objectiveDiv.style.position = 'relative';
            objectiveDiv.appendChild(notification);

            // Show and then fade out notification
            setTimeout(() => {
                notification.style.opacity = '1';
                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 300);
                }, 2000);
            }, 10);
        });

        // Add event listener for objective name editing
        const objectiveName = headerDiv.querySelector('.objective-name');
        objectiveName.addEventListener('input', () => {
            markSchemeData.mark_scheme[objIndex].objective = objectiveName.textContent.trim();
        });

        // Add event listener for weight editing
        const weightField = headerDiv.querySelector('.objective-weight .editable-field');
        weightField.addEventListener('input', () => {
            const weightValue = weightField.textContent.trim();
            if (weightValue === '') {
                // If weight is empty, set to null
                markSchemeData.mark_scheme[objIndex].weight = null;
            } else {
                // Convert to decimal number (float)
                markSchemeData.mark_scheme[objIndex].weight = parseFloat(weightValue) || 0;
            }

            // Update is_weighted based on whether any objective has a weight
            markSchemeData.is_weighted = calculateIsWeighted(markSchemeData);
        });

        // Add event listener for objective deletion
        const deleteObjectiveBtn = headerDiv.querySelector('.delete-objective-btn');
        deleteObjectiveBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this objective?')) {
                markSchemeData.mark_scheme.splice(objIndex, 1);
                renderMarkScheme(markSchemeData);
            }
        });

        // Create levels container for sortable functionality
        const levelsContainer = document.createElement('div');
        levelsContainer.className = 'levels-container';
        levelsContainer.dataset.objIndex = objIndex;
        objectiveDiv.appendChild(levelsContainer);

        // Levels
        if (obj.mark_scheme && Array.isArray(obj.mark_scheme)) {
            obj.mark_scheme.forEach((level, levelIndex) => {
                const levelDiv = document.createElement('div');
                levelDiv.className = 'mark-scheme-level';
                levelDiv.dataset.levelIndex = levelIndex;

                // Level header
                const levelHeader = document.createElement('div');
                levelHeader.className = 'level-header';
                levelHeader.innerHTML = `
                    <div class="level-drag-handle" title="Drag to reorder level"><i class="fas fa-grip-lines"></i></div>
                    <div class="level-info">
                        <div class="level-title">
                            <span>Level </span>
                            <span contenteditable="true" class="editable-field level-number">
                                ${level.level || '?'}
                            </span>
                        </div>
                        <div class="level-marks">
                            <span contenteditable="true" class="editable-field lower-mark">
                                ${level.lower_mark_bound || '0'}
                            </span>
                            <span> - </span>
                            <span contenteditable="true" class="editable-field upper-mark">
                                ${level.upper_mark_bound || '0'}
                            </span>
                            <span> marks</span>
                        </div>
                    </div>
                    <div class="level-controls">
                        <button class="btn btn-sm btn-danger delete-level-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                levelDiv.appendChild(levelHeader);

                // Add event listeners for level details editing
                const levelNumber = levelHeader.querySelector('.level-number');
                levelNumber.addEventListener('input', () => {
                    markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex].level = levelNumber.textContent.trim();
                });

                const lowerMark = levelHeader.querySelector('.lower-mark');
                lowerMark.addEventListener('input', () => {
                    markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex].lower_mark_bound =
                        parseInt(lowerMark.textContent.trim()) || 0;
                });

                const upperMark = levelHeader.querySelector('.upper-mark');
                upperMark.addEventListener('input', () => {
                    markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex].upper_mark_bound =
                        parseInt(upperMark.textContent.trim()) || 0;
                });

                // Add event listener for level deletion
                const deleteLevelBtn = levelHeader.querySelector('.delete-level-btn');
                deleteLevelBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this level?')) {
                        markSchemeData.mark_scheme[objIndex].mark_scheme.splice(levelIndex, 1);

                        // Re-number the levels after deletion
                        renumberLevels(markSchemeData.mark_scheme[objIndex].mark_scheme);

                        renderMarkScheme(markSchemeData);
                    }
                });

                // Skills
                if (level.skills_descriptors && Array.isArray(level.skills_descriptors)) {
                    const skillsSection = document.createElement('div');
                    skillsSection.className = 'skills-section mt-3';
                    skillsSection.innerHTML = '<h6 class="skills-title">Skills Descriptors:</h6>';

                    const skillsList = document.createElement('ul');
                    skillsList.className = 'skills-list';

                    level.skills_descriptors.forEach((skill, skillIndex) => {
                        const skillItem = document.createElement('li');
                        skillItem.className = 'skill-item';
                        skillItem.innerHTML = `
                            <div class="skill-content">
                                <div contenteditable="true" class="editable-field skill-text">
                                    ${skill || ''}
                                </div>
                            </div>
                            <div class="skill-controls">
                                <button class="btn btn-sm btn-outline-danger delete-skill-btn">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `;

                        // Add event listener for skill editing
                        const skillText = skillItem.querySelector('.skill-text');
                        skillText.addEventListener('input', () => {
                            markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex].skills_descriptors[skillIndex] =
                                skillText.textContent.trim();
                        });

                        // Add event listener for skill deletion
                        const deleteSkillBtn = skillItem.querySelector('.delete-skill-btn');
                        deleteSkillBtn.addEventListener('click', () => {
                            markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex].skills_descriptors.splice(skillIndex, 1);
                            renderMarkScheme(markSchemeData);
                        });

                        skillsList.appendChild(skillItem);
                    });

                    skillsSection.appendChild(skillsList);

                    // Add new skill button
                    const addSkillBtn = document.createElement('button');
                    addSkillBtn.className = 'btn btn-sm btn-outline-success mt-2';
                    addSkillBtn.innerHTML = '<i class="fas fa-plus me-1"></i> Add Skill';
                    addSkillBtn.addEventListener('click', () => {
                        markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex].skills_descriptors.push('New skill');
                        renderMarkScheme(markSchemeData);
                    });

                    skillsSection.appendChild(addSkillBtn);
                    levelDiv.appendChild(skillsSection);
                }

                // Indicative Standard (if present)
                if (level.indicative_standard !== undefined) {
                    const indicativeDiv = document.createElement('div');
                    indicativeDiv.className = 'indicative-standard mt-3';
                    indicativeDiv.innerHTML = `
                        <h6 class="indicative-title">Indicative Standard:</h6>
                        <div contenteditable="true" class="editable-field indicative-content p-2">
                            ${level.indicative_standard || ''}
                        </div>
                    `;
                    levelDiv.appendChild(indicativeDiv);

                    // Add event listener for indicative standard editing
                    const indicativeContent = indicativeDiv.querySelector('.indicative-content');
                    indicativeContent.addEventListener('input', () => {
                        markSchemeData.mark_scheme[objIndex].mark_scheme[levelIndex].indicative_standard =
                            indicativeContent.textContent.trim() || null;
                    });
                }

                levelsContainer.appendChild(levelDiv);
            });
        }

        // Initialize Sortable.js for level reordering
        const levelsSortable = new Sortable(levelsContainer, {
            animation: 150,
            handle: '.level-drag-handle',
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            scroll: false, // Disable automatic scrolling
            scrollSensitivity: 0, // Disable scroll sensitivity
            onStart: function(evt) {
                // Get the container that holds all levels
                const levelsContainer = evt.from;

                // Collapse all levels when drag starts
                const allLevels = levelsContainer.querySelectorAll('.mark-scheme-level');
                allLevels.forEach(level => {
                    // Store current height for smooth transition back
                    level.dataset.originalHeight = level.offsetHeight + 'px';
                    // Add collapsing class
                    level.classList.add('level-collapsing');
                    // After small delay for animation to start, add collapsed class
                    setTimeout(() => {
                        level.classList.add('level-collapsed');
                    }, 50);
                });

                // Add a class to the container to indicate active sorting
                levelsContainer.classList.add('sorting-active');

                // Center the view on the levels container
                setTimeout(() => {
                    const containerRect = levelsContainer.getBoundingClientRect();
                    const containerMiddle = containerRect.top + (containerRect.height / 2);
                    const viewportMiddle = window.innerHeight / 2;
                    const scrollAdjustment = containerMiddle - viewportMiddle;

                    window.scrollTo({
                        top: window.pageYOffset + scrollAdjustment,
                        behavior: 'smooth'
                    });
                }, 100); // Small delay to ensure collapse has started

                // Prevent default autoscroll behavior from SortableJS
                this.options.scroll = false;
                this.options.scrollSensitivity = 0;
            },
            onEnd: function(evt) {
                // Get the container
                const levelsContainer = evt.from;

                // Remove the sorting active class
                levelsContainer.classList.remove('sorting-active');

                // Expand all levels when drag ends
                const allLevels = levelsContainer.querySelectorAll('.mark-scheme-level');
                allLevels.forEach(level => {
                    // Remove collapsed class first
                    level.classList.remove('level-collapsed');
                    // After animation completes, remove collapsing class
                    setTimeout(() => {
                        level.classList.remove('level-collapsing');
                    }, 300); // Match to CSS transition duration
                });

                // Update the markSchemeData object when levels are reordered
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;

                if (oldIndex !== newIndex) {
                    // Get the current levels array
                    const levels = markSchemeData.mark_scheme[objIndex].mark_scheme;

                    // Move the level to the new position
                    const movedLevel = levels.splice(oldIndex, 1)[0];
                    levels.splice(newIndex, 0, movedLevel);

                    // Re-number the levels after reordering
                    renumberLevels(levels);

                    // Re-render the mark scheme to reflect the changes
                    // But wait until animation completes
                    setTimeout(() => {
                        renderMarkScheme(markSchemeData);
                    }, 350);
                }
            }
        });

        // Add new level button
        const addLevelBtn = document.createElement('button');
        addLevelBtn.className = 'btn btn-outline-primary btn-sm mb-3 mt-3';
        addLevelBtn.innerHTML = '<i class="fas fa-plus me-1"></i> Add Level';
        addLevelBtn.addEventListener('click', () => {
            if (!markSchemeData.mark_scheme[objIndex].mark_scheme) {
                markSchemeData.mark_scheme[objIndex].mark_scheme = [];
            }

            // Find the next level number
            const nextLevelNumber = getNextLevelNumber(markSchemeData.mark_scheme[objIndex].mark_scheme);

            markSchemeData.mark_scheme[objIndex].mark_scheme.push({
                level: nextLevelNumber.toString(),
                lower_mark_bound: 0,
                upper_mark_bound: 0,
                skills_descriptors: ['New skill descriptor'],
                indicative_standard: null
            });

            renderMarkScheme(markSchemeData);
        });

        objectiveDiv.appendChild(addLevelBtn);

        // Objective-specific Indicative Content section (always show it - at the bottom)
        const indicativeContentDiv = document.createElement('div');
        indicativeContentDiv.className = 'indicative-content-section mt-4';
        indicativeContentDiv.innerHTML = `
            <div class="section-header">
                <h5 class="indicative-content-title">Indicative Content</h5>
            </div>
            <div contenteditable="true" class="editable-field indicative-content-text p-2">
                ${obj.indicative_content || ''}
            </div>
        `;
        objectiveDiv.appendChild(indicativeContentDiv);

        // Add event listener for indicative content editing
        const indicativeContentText = indicativeContentDiv.querySelector('.indicative-content-text');
        indicativeContentText.addEventListener('input', () => {
            markSchemeData.mark_scheme[objIndex].indicative_content = indicativeContentText.textContent.trim() || null;
        });

        // Objective-specific Guidance section (always show it - at the bottom)
        const guidanceDiv = document.createElement('div');
        guidanceDiv.className = 'guidance-section mb-3 mt-4';
        guidanceDiv.innerHTML = `
            <div class="section-header">
                <h5 class="guidance-title">Guidance</h5>
            </div>
            <div contenteditable="true" class="editable-field guidance-content p-2">
                ${obj.guidance || ''}
            </div>
        `;
        objectiveDiv.appendChild(guidanceDiv);

        // Add event listener for guidance editing
        const guidanceContent = guidanceDiv.querySelector('.guidance-content');
        guidanceContent.addEventListener('input', () => {
            markSchemeData.mark_scheme[objIndex].guidance = guidanceContent.textContent.trim() || null;
        });

        markSchemeContent.appendChild(objectiveDiv);
    });

    // Add new objective button
    const addObjectiveBtn = document.createElement('button');
    addObjectiveBtn.className = 'btn btn-primary mb-4';
    addObjectiveBtn.innerHTML = '<i class="fas fa-plus me-1"></i> Add Assessment Objective';
    addObjectiveBtn.addEventListener('click', () => {
        const newObj = 'AO' + (markSchemeData.mark_scheme.length + 1);
        markSchemeData.mark_scheme.push({
            objective: newObj,
            mark_scheme: [
                {
                    level: '1',
                    lower_mark_bound: 1,
                    upper_mark_bound: 5,
                    skills_descriptors: ['New skill descriptor'],
                    indicative_standard: null
                }
            ],
            weight: null
        });

        renderMarkScheme(markSchemeData);
    });

    markSchemeContent.appendChild(addObjectiveBtn);

    // Initialize searchable subject dropdown
    initSubjectDropdown();
}

// Helper function to find the next level number
function getNextLevelNumber(levels) {
    if (!levels || levels.length === 0) {
        return 1; // Start with level 1 if no levels exist
    }

    // Extract current level numbers as integers
    const levelNumbers = levels.map(level => {
        const levelNum = parseInt(level.level);
        return isNaN(levelNum) ? 0 : levelNum;
    });

    // Find the maximum level number
    const maxLevel = Math.max(...levelNumbers);

    // Return the next level number (max + 1)
    return maxLevel + 1;
}

// Helper function to re-number levels based on their position
function renumberLevels(levels) {
    if (!levels || !Array.isArray(levels)) return;

    // Sort levels by position (highest to lowest)
    // We assume the levels array is already in the desired order after drag & drop

    // Assign level numbers from highest to lowest
    let currentLevelNumber = levels.length - 1;

    // We'll keep level "0" as is (if it exists)
    levels.forEach((level, index) => {
        if (level.level === "0") {
            // Keep level 0 as is
            return;
        }

        level.level = currentLevelNumber.toString();
        currentLevelNumber--;

        // Ensure we don't go below 0
        if (currentLevelNumber < 0) {
            currentLevelNumber = 0;
        }
    });
}

// Add CSS for sortable level functionality
function addLevelSortingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .level-drag-handle {
            cursor: grab;
            padding: 0 10px;
            color: #aaa;
            display: flex;
            align-items: center;
        }

        .level-drag-handle:hover {
            color: #3498db;
        }

        .level-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e9ecef;
        }

        .level-info {
            flex-grow: 1;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .level-controls {
            margin-left: auto;
        }

        /* Collapsing animation styles */
        .level-collapsing {
            transition: all 0.3s ease-in-out;
            overflow: hidden;
        }

        .level-collapsed {
            max-height: 60px !important; /* Only show header */
            overflow: hidden;
        }

        .level-collapsed .skills-section,
        .level-collapsed .indicative-standard {
            opacity: 0;
        }

        /* Keep the level being dragged visible */
        .sortable-ghost {
            opacity: 0.4;
            background-color: #e3f2fd !important;
            max-height: 60px !important;
        }

        .sortable-chosen {
            background-color: #f8f9fa;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 100;
        }

        .sortable-drag {
            background-color: #fff;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            max-height: 60px !important;
            overflow: hidden;
        }

        /* Enhanced indication when in reordering mode */
        .levels-container.sorting-active {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 5px;
        }

        /* Make collapsed level headers more readable */
        .level-collapsed .level-header {
            margin-bottom: 0;
            border-bottom: none;
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 8px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize level sorting styles when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for level sorting
    addLevelSortingStyles();
});

    // Validate Mark Scheme
    async function validateMarkScheme(markSchemeData) {
        try {
            const response = await fetch('/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(markSchemeData)
            });

            return await response.json();
        } catch (error) {
            console.error('Validation error:', error);
            return {
                valid: false,
                errors: [`Error validating mark scheme: ${error.message}`]
            };
        }
    }

    // Get processed JSON with assessment objective IDs
    async function getProcessedJson(markSchemeData) {
        try {
            const response = await fetch('/get_processed_json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(markSchemeData)
            });

            return await response.json();
        } catch (error) {
            console.error('Error getting processed JSON:', error);
            return {
                success: false,
                errors: [`Error getting processed JSON: ${error.message}`]
            };
        }
    }

    // Format JSON with proper indentation
    function formatJson(json) {
        return JSON.stringify(json, null, 2);
    }

    // Copy JSON to clipboard
    function copyJsonToClipboard() {
        const jsonText = jsonOutput.textContent;

        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(jsonText)
                .then(() => {
                    // Show success notification
                    const originalText = copyJsonBtn.innerHTML;
                    copyJsonBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
                    copyJsonBtn.classList.remove('btn-success');
                    copyJsonBtn.classList.add('btn-success', 'btn-copied');

                    // Reset button after 2 seconds
                    setTimeout(() => {
                        copyJsonBtn.innerHTML = originalText;
                        copyJsonBtn.classList.remove('btn-copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy to clipboard: ' + err);

                    // Fallback to older method
                    fallbackCopyToClipboard(jsonText);
                });
        } else {
            // Fallback for older browsers
            fallbackCopyToClipboard(jsonText);
        }
    }

    // Fallback copy method for older browsers
    function fallbackCopyToClipboard(text) {
        try {
            // Create temporary textarea to copy from
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', ''); // Prevent keyboard from showing on mobile
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px'; // Move outside the screen
            document.body.appendChild(textarea);

            // Check if there's text selected
            const selected = document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0) : false;

            // Select the text in the textarea
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length); // For mobile devices

            // Copy and remove textarea
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (successful) {
                // Show success notification
                const originalText = copyJsonBtn.innerHTML;
                copyJsonBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied!';
                copyJsonBtn.classList.remove('btn-success');
                copyJsonBtn.classList.add('btn-success', 'btn-copied');

                // Reset button after 2 seconds
                setTimeout(() => {
                    copyJsonBtn.innerHTML = originalText;
                    copyJsonBtn.classList.remove('btn-copied');
                }, 2000);
            } else {
                alert('Failed to copy text to clipboard');
            }

            // Restore original selection if there was one
            if (selected) {
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(selected);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard: ' + err);
        }
    }

    // Event Listeners

    // Input type toggle
    imageInputRadio.addEventListener('change', () => {
        if (imageInputRadio.checked) {
            toggleInputType('image');
        }
    });

    textInputRadio.addEventListener('change', () => {
        if (textInputRadio.checked) {
            toggleInputType('text');
        }
    });

    // Upload Handlers
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFiles(fileInput.files);
        }
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');

        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    uploadBtn.addEventListener('click', async () => {
        console.log('Upload button clicked');
        console.log(`uploadedFiles length: ${uploadedFiles.length}`);

        if (uploadedFiles.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        showLoading('Uploading images...');

        const formData = new FormData();
        uploadedFiles.forEach((file, index) => {
            console.log(`Adding file to FormData: ${file.name}`);
            formData.append('files[]', file);
        });

        try {
            console.log('Sending upload request...');
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            console.log('Response received:', response.status);

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Parsed response data:', data);

            if (data.error) {
                throw new Error(data.error);
            }

            // Check if it's a single image upload and the server indicates to skip stitching
            if (data.single_image) {
                console.log('Single image detected - skipping stitching step');

                // Set the stitched image in preview
                stitchedPreview.src = data.stitched_image_url;

                // Hide the arrange container since we're skipping that step
                arrangeContainer.style.display = 'none';

                // Show the preview container instead
                previewContainer.style.display = 'block';

                // Smooth scroll to preview section
                previewContainer.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Multiple images - show arrange section for stitching
                populateSortableList(data.files);
                arrangeContainer.style.display = 'block';

                // Smooth scroll to arrange section
                arrangeContainer.scrollIntoView({ behavior: 'smooth' });
            }

            hideLoading();
        } catch (error) {
            hideLoading();
            console.error('Upload error:', error);
            alert(`Error uploading files: ${error.message}`);
        }
    });

    // Process Text Button
    processTextBtn.addEventListener('click', async () => {
        const textContent = markSchemeText.value.trim();

        if (!textContent) {
            alert('Please enter some text to process');
            return;
        }

        showLoading('Processing text...');

        try {
            const response = await fetch('/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input_type: 'text',
                    text_content: textContent
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Store mark scheme data
            markSchemeData = data.mark_scheme;

            // Populate form
            renderMarkScheme(markSchemeData);
            markSchemeContainer.style.display = 'block';

            // Smooth scroll to mark scheme section
            markSchemeContainer.scrollIntoView({ behavior: 'smooth' });

            hideLoading();
        } catch (error) {
            hideLoading();
            alert(`Error processing text: ${error.message}`);
        }
    });

    // Preview button
    previewBtn.addEventListener('click', updatePreview);

    // Extract Mark Scheme
    extractBtn.addEventListener('click', async () => {
        showLoading('Extracting mark scheme...');

        try {
            const response = await fetch('/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input_type: 'image' })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Store mark scheme data
            markSchemeData = data.mark_scheme;

            // Populate form
            renderMarkScheme(markSchemeData);
            markSchemeContainer.style.display = 'block';

            // Smooth scroll to mark scheme section
            markSchemeContainer.scrollIntoView({ behavior: 'smooth' });

            hideLoading();
        } catch (error) {
            hideLoading();
            alert(`Error extracting mark scheme: ${error.message}`);
        }
    });

    // View JSON button
    viewJsonBtn.addEventListener('click', async () => {
        if (!markSchemeData) {
            alert('No mark scheme data to view');
            return;
        }

        // Get basic info from form inputs
        const subject = subjectInput.value;
        const title = titleInput.value;
        const qualificationLevel = qualificationLevelSelect.value;
        const examBoard = examBoardSelect.value;


        // Create a copy of the mark scheme data
        const displayData = JSON.parse(JSON.stringify(markSchemeData));
        displayData.subject = subject;
        displayData.qualification_level = qualificationLevel;
        displayData.exam_board = examBoard;
        displayData.title = title;
        displayData.is_weighted = calculateIsWeighted(displayData);

        // Get all objectives
        const objectives = displayData.mark_scheme || [];

        // Store any common guidance and indicative content
        let commonGuidance = null;
        let commonIndicativeContent = null;

        // Directly get guidance and indicative content from the UI for each objective
        const objectiveElements = document.querySelectorAll('.mark-scheme-objective');
        objectiveElements.forEach((objElement, index) => {
            if (index >= objectives.length) return;

            // Get objective guidance
            const objGuidanceElement = objElement.querySelector('.guidance-section .guidance-content');
            if (objGuidanceElement) {
                objectives[index].guidance = objGuidanceElement.textContent.trim() || null;

                // Use first non-empty guidance as common guidance
                if (objectives[index].guidance && !commonGuidance) {
                    commonGuidance = objectives[index].guidance;
                }
            }

            // Get objective indicative content
            const objIndicativeElement = objElement.querySelector('.indicative-content-section .indicative-content-text');
            if (objIndicativeElement) {
                objectives[index].indicative_content = objIndicativeElement.textContent.trim() || null;

                // Use first non-empty indicative content as common indicative content
                if (objectives[index].indicative_content && !commonIndicativeContent) {
                    commonIndicativeContent = objectives[index].indicative_content;
                }
            }
        });

        // Check if all objectives have the same guidance and indicative content
        let allSameGuidance = true;
        let allSameIndicativeContent = true;

        if (commonGuidance || commonIndicativeContent) {
            objectives.forEach(obj => {
                if (obj.guidance !== commonGuidance) {
                    allSameGuidance = false;
                }
                if (obj.indicative_content !== commonIndicativeContent) {
                    allSameIndicativeContent = false;
                }
            });
        } else {
            allSameGuidance = false;
            allSameIndicativeContent = false;
        }



        // Get global guidance if it exists
        const globalGuidanceElement = document.querySelector('.global-guidance-section .guidance-content');
        if (globalGuidanceElement) {
            const globalGuidance = globalGuidanceElement.textContent.trim();
            if (globalGuidance) {
                // Apply global guidance to any objective that doesn't have its own
                objectives.forEach(obj => {
                    if (!obj.guidance) {
                        obj.guidance = globalGuidance;
                    }
                });
            }
        }

        // Get global indicative content if it exists
        const globalIndicativeElement = document.querySelector('.global-indicative-content-section .indicative-content-text');
        if (globalIndicativeElement) {
            const globalIndicative = globalIndicativeElement.textContent.trim();
            if (globalIndicative) {
                // Apply global indicative content to any objective that doesn't have its own
                objectives.forEach(obj => {
                    if (!obj.indicative_content) {
                        obj.indicative_content = globalIndicative;
                    }
                });
            }
        }

        // Hide previous validation errors
        hideValidationErrors();

        // Validate mark scheme
        showLoading('Validating mark scheme...');
        const validationResult = await validateMarkScheme(displayData);

        if (!validationResult.valid) {
            hideLoading();
            showValidationErrors(validationResult.errors);
            return;
        }

        // Get the processed JSON with assessment objective IDs from the server
        showLoading('Processing mark scheme...');

        try {
            // Send to server for processing to get assessment objective IDs
            const response = await fetch('/get_processed_json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(displayData)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.errors ? result.errors.join(', ') : 'Failed to process mark scheme');
            }

            // Extract assessment objective IDs from server response
            const processedData = result.processed_data;
            if (processedData && processedData.mark_scheme) {
                // Update our objectives with assessment objective IDs from the server
                processedData.mark_scheme.forEach((serverObj, index) => {
                    if (index < objectives.length) {
                        objectives[index].assessment_objective_id = serverObj.assessment_objective_id;
                    }
                });
            }

            // Format the data in the right order for display
            const finalOrderedData = {
                mark_scheme: objectives.map(obj => ({
                    assessment_objective_id: obj.assessment_objective_id || "unknown",
                    objective: obj.objective || "",
                    mark_scheme: Array.isArray(obj.mark_scheme) ? obj.mark_scheme.map(level => ({
                        level: level.level || "",
                        lower_mark_bound: level.lower_mark_bound,
                        upper_mark_bound: level.upper_mark_bound,
                        skills_descriptors: level.skills_descriptors || [],
                        indicative_standard: level.indicative_standard
                    })) : [],
                    guidance: obj.guidance || null,
                    indicative_content: obj.indicative_content || null,
                    weight: obj.weight
                })),
                subject: subject || "",
                qualification_level: qualificationLevel || "",
                exam_board: examBoard || "",
                title: title || "",
                is_weighted: displayData.is_weighted
            };


            hideLoading();

            // Set flag to indicate modal is open
            isModalOpen = true;

            // Format and display JSON in modal
            jsonOutput.textContent = formatJson(finalOrderedData);

            // Show the modal
            const modal = new bootstrap.Modal(jsonModal);
            modal.show();

            // Add event listener for modal close
            jsonModal.addEventListener('hidden.bs.modal', () => {
                // Reset modal open flag
                isModalOpen = false;
            }, { once: true });
        } catch (error) {
            hideLoading();
            console.error('Error processing mark scheme:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Copy JSON button
    copyJsonBtn.addEventListener('click', copyJsonToClipboard);

    // Submit Mark Scheme
    submitBtn.addEventListener('click', async () => {
        if (!markSchemeData) {
            alert('No mark scheme data to submit');
            return;
        }

        // Get basic info from form inputs
        const subject = subjectInput.value;
        const title = titleInput.value;
        const qualificationLevel = qualificationLevelSelect.value;
        const examBoard = examBoardSelect.value;

        // Create a copy of the mark scheme data
        const submitData = JSON.parse(JSON.stringify(markSchemeData));
        submitData.subject = subject;
        submitData.qualification_level = qualificationLevel;
        submitData.exam_board = examBoard;
        submitData.title = title;
        submitData.is_weighted = calculateIsWeighted(submitData);

        // Get all objectives
        const objectives = submitData.mark_scheme || [];

        // Directly get guidance and indicative content from the UI for each objective
        const objectiveElements = document.querySelectorAll('.mark-scheme-objective');
        objectiveElements.forEach((objElement, index) => {
            if (index >= objectives.length) return;

            // Get objective guidance
            const objGuidanceElement = objElement.querySelector('.guidance-section .guidance-content');
            if (objGuidanceElement) {
                objectives[index].guidance = objGuidanceElement.textContent.trim() || null;
            }

            // Get objective indicative content
            const objIndicativeElement = objElement.querySelector('.indicative-content-section .indicative-content-text');
            if (objIndicativeElement) {
                objectives[index].indicative_content = objIndicativeElement.textContent.trim() || null;
            }
        });

        // Get global guidance if it exists
        const globalGuidanceElement = document.querySelector('.global-guidance-section .guidance-content');
        if (globalGuidanceElement) {
            const globalGuidance = globalGuidanceElement.textContent.trim();
            if (globalGuidance) {
                // Apply global guidance to any objective that doesn't have its own
                objectives.forEach(obj => {
                    if (!obj.guidance) {
                        obj.guidance = globalGuidance;
                    }
                });
            }
        }

        // Get global indicative content if it exists
        const globalIndicativeElement = document.querySelector('.global-indicative-content-section .indicative-content-text');
        if (globalIndicativeElement) {
            const globalIndicative = globalIndicativeElement.textContent.trim();
            if (globalIndicative) {
                // Apply global indicative content to any objective that doesn't have its own
                objectives.forEach(obj => {
                    if (!obj.indicative_content) {
                        obj.indicative_content = globalIndicative;
                    }
                });
            }
        }

        // Hide previous validation errors
        hideValidationErrors();

        // Validate mark scheme
        showLoading('Validating mark scheme...');
        const validationResult = await validateMarkScheme(submitData);

        if (!validationResult.valid) {
            hideLoading();
            showValidationErrors(validationResult.errors);
            return;
        }

        // Get the processed JSON with assessment objective IDs
        showLoading('Processing mark scheme...');

        try {
            // First get assessment objective IDs from the server
            const processResponse = await fetch('/get_processed_json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            const processResult = await processResponse.json();

            if (!processResult.success) {
                throw new Error(processResult.errors ? processResult.errors.join(', ') : 'Failed to process mark scheme');
            }

            // Extract assessment objective IDs from server response
            const processedData = processResult.processed_data;
            if (processedData && processedData.mark_scheme) {
                // Update our objectives with assessment objective IDs from the server
                processedData.mark_scheme.forEach((serverObj, index) => {
                    if (index < objectives.length) {
                        objectives[index].assessment_objective_id = serverObj.assessment_objective_id;
                    }
                });
            }

            // Create transformed objectives with fields in the correct order
            const transformed_objectives = objectives.map(objective_item => ({
                assessment_objective_id: objective_item.assessment_objective_id || "unknown",
                objective: objective_item.objective || "",
                mark_scheme: objective_item.mark_scheme || [],
                guidance: objective_item.guidance || null,
                indicative_content: objective_item.indicative_content || null,
                weight: (objective_item.weight !== undefined) ? objective_item.weight : null
            }));

            // Build the final data object with fields in the correct order
            const finalData = {
                mark_scheme: transformed_objectives,
                subject: subject || "",
                qualification_level: qualificationLevel || "",
                exam_board: examBoard || "",
                title: title || "",
                is_weighted: (submitData.is_weighted !== undefined) ? submitData.is_weighted : null
            };

            console.log('Uploading mark scheme with the following data:');
            console.log(JSON.stringify(finalData, null, 2));

            // Submit the final data to the server
            const submitResponse = await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            const submitResult = await submitResponse.json();

            if (!submitResponse.ok || submitResult.error) {
                throw new Error(submitResult.error || 'Failed to submit mark scheme');
            }

            // Success
            hideLoading();

            // Show success message
            successText.textContent = submitResult.message || 'Mark scheme submitted successfully!';
            successMessage.style.display = 'block';

            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        } catch (error) {
            hideLoading();
            console.error('Error submitting mark scheme:', error);
            alert(`Error: ${error.message}`);
        }
    });

    // Initialize subject dropdown on page load
    initSubjectDropdown();

    // Initialize the countryside theme
    setupCountrysideTheme();

    function handlePaste(e) {
        // Check if we're in image input mode
        if (currentInputType !== 'image') return;

        // Check if the event has clipboard data with items
        if (!e.clipboardData || !e.clipboardData.items) return;

        // Check each clipboard item
        const items = e.clipboardData.items;
        let pastedImage = false;

        for (let i = 0; i < items.length; i++) {
            // Check if the item is an image
            if (items[i].type.indexOf('image') !== -1) {
                // Get the image as a blob
                const blob = items[i].getAsFile();

                // Create a unique filename for the pasted image
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `pasted-image-${timestamp}.png`;

                // Create a new File object (more compatible than blob)
                const file = new File([blob], filename, { type: blob.type });

                // Add unique ID to file
                const fileId = `file-paste-${Date.now()}`;
                file.id = fileId;

                // Add to uploadedFiles array
                uploadedFiles.push(file);

                // Create a preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    const div = document.createElement('div');
                    div.className = 'col-6 col-md-4 col-lg-3';
                    div.dataset.fileId = fileId;
                    div.innerHTML = `
                        <div class="card">
                            <button type="button" class="remove-image-btn" data-file-id="${fileId}">
                                <i class="fas fa-times"></i>
                            </button>
                            <img src="${imageUrl}" class="card-img-top clickable-image" alt="${filename}" style="height: 120px; object-fit: cover;">
                            <div class="card-body p-2">
                                <p class="card-text small text-truncate">${filename}</p>
                            </div>
                        </div>
                    `;

                    // Add click event for image preview
                    const imgElement = div.querySelector('.clickable-image');
                    imgElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showImagePreview(imageUrl, filename);
                    });

                    // Add click event for remove button
                    const removeBtn = div.querySelector('.remove-image-btn');
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Remove from uploadedFiles array
                        uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
                        // Remove the preview element
                        div.remove();
                        console.log(`Removed file. Remaining files: ${uploadedFiles.length}`);
                    });

                    uploadPreview.appendChild(div);

                    // Show success notification for pasted image
                    showPasteNotification();
                };
                reader.readAsDataURL(file);

                pastedImage = true;
                e.preventDefault(); // Prevent default paste behavior
                break; // Only handle the first image
            }
        }

        return pastedImage;
    }

    // Function to show a notification when an image is pasted
    function showPasteNotification() {
        // Create notification element if it doesn't exist
        if (!document.getElementById('pasteNotification')) {
            const notification = document.createElement('div');
            notification.id = 'pasteNotification';
            notification.className = 'paste-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle me-2"></i>
                    Image pasted successfully!
                </div>
            `;
            document.body.appendChild(notification);
        }

        // Get notification element
        const notification = document.getElementById('pasteNotification');

        // Show notification
        notification.classList.add('show');

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Add event listener for paste event
    document.addEventListener('paste', handlePaste);

    // Reset app to initial state
    function resetApp() {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to start a new mark scheme? All current progress will be lost.')) {
            return;
        }

        // Clear all form inputs
        subjectInput.value = '';
        titleInput.value = '';
        qualificationLevelSelect.value = '';
        examBoardSelect.value = '';

        // Clear file input and preview
        fileInput.value = '';
        uploadPreview.innerHTML = '';

        // Clear text input
        if (markSchemeText) {
            markSchemeText.value = '';
        }

        // Clear sortable list
        if (sortableList) {
            sortableList.innerHTML = '';
        }

        // Clear mark scheme content
        if (markSchemeContent) {
            markSchemeContent.innerHTML = '';
        }

        // Reset all containers visibility
        markSchemeContainer.style.display = 'none';
        arrangeContainer.style.display = 'none';
        previewContainer.style.display = 'none';

        // Reset validation messages
        validationMessages.style.display = 'none';

        // Hide success message if showing
        successMessage.style.display = 'none';

        // Reset state variables
        uploadedFiles = [];
        markSchemeData = null;

        // Show the first step based on current input type
        toggleInputType(currentInputType);

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Add event listener for restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', resetApp);
    }

    function balanceMarkSchemeMarks(markSchemeLevels) {
        // Filter out level 0 which always gets 0 marks
        const levelsNonZero = markSchemeLevels.filter(level => parseInt(level.level) > 0);
        if (levelsNonZero.length === 0) {
            console.error("No levels above 0 in the mark scheme.");
            return markSchemeLevels;
        }

        // Sort levels by number (descending order): Level 4, Level 3, Level 2, Level 1
        const sortedLevels = [...levelsNonZero].sort((a, b) => parseInt(b.level) - parseInt(a.level));

        // Get total marks from the highest level's upper mark bound
        const totalMarks = sortedLevels[0].upper_mark_bound;

        // Calculate how many marks each level should get
        const totalLevels = sortedLevels.length;
        const baseInterval = Math.floor(totalMarks / totalLevels);
        const remainder = totalMarks % totalLevels;

        // Create a result array to hold the updated levels
        const resultLevels = [];

        // Start at the highest mark and work downward
        let currentMark = totalMarks;

        // Assign marks to each level from highest to lowest
        for (let i = 0; i < sortedLevels.length; i++) {
            const level = sortedLevels[i];
            const marksForThisLevel = baseInterval + (i < remainder ? 1 : 0);

            const upperBound = currentMark;
            const lowerBound = Math.max(1, currentMark - marksForThisLevel + 1);

            resultLevels.push({
                ...level,
                upper_mark_bound: upperBound,
                lower_mark_bound: lowerBound
            });

            currentMark = lowerBound - 1;
        }

        // Map back to the original array structure
        return markSchemeLevels.map(level => {
            if (parseInt(level.level) === 0) {
                return { ...level, lower_mark_bound: 0, upper_mark_bound: 0 };
            } else {
                // Find the corresponding updated level
                const updatedLevel = resultLevels.find(ul => ul.level === level.level);
                return updatedLevel || level;
            }
        });
    }

    // Function to calculate if the mark scheme is weighted
    function calculateIsWeighted(data) {
        if (!data || !data.mark_scheme || !Array.isArray(data.mark_scheme)) {
            return false;
        }

        // Check if any objective has a non-null weight
        return data.mark_scheme.some(obj =>
            obj.weight !== undefined &&
            obj.weight !== null &&
            obj.weight !== '' &&
            !isNaN(parseFloat(obj.weight))
        );
    }

});
