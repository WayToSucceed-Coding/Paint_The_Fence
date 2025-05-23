const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// Game variables
let fencePlanks = [];
let paintedCount = 0;
let checkButton;
let fractionText;
let answerButtons = [];
let feedbackText;
let plankWidth = 50;
let plankHeight = 200;
let fenceX = 150;
let fenceY = 300;

function preload() {
    // No assets to load in this version
}

function create() {
    // Create simple background
    this.add.rectangle(0, 0, 800, 600, 0x87CEEB).setOrigin(0);
    this.add.rectangle(0, 400, 800, 200, 0x7CFC00).setOrigin(0); // Grass
    
    // Create sun
    this.add.circle(100, 100, 50, 0xFFFF00);
    
    // Create fence planks
    for (let i = 0; i < 10; i++) {
        const plank = this.add.rectangle(
            fenceX + i * (plankWidth + 5), 
            fenceY, 
            plankWidth, 
            plankHeight, 
            0x8B4513 // Brown
        ).setOrigin(0.5);
        
        plank.setInteractive();
        plank.setData('painted', false);
        plank.setData('index', i);
        
        plank.on('pointerdown', () => {
            togglePlank(plank);
        });
        
        fencePlanks.push(plank);
    }
    
    // Add fence top
    const fenceTop = this.add.rectangle(
        fenceX + (plankWidth * 5) + 22.5, 
        fenceY - plankHeight/2 - 10, 
        plankWidth * 10 + 45, 
        20, 
        0x5D4037 // Darker brown
    );
    fenceTop.setOrigin(0.5);
    
    // Add instruction text
    const instructionText = this.add.text(
        400, 50, 
        'Paint the fence by clicking on the planks!', 
        { 
            font: '24px Arial', 
            fill: '#000000', 
            align: 'center',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        }
    );
    instructionText.setOrigin(0.5);
    
    // Create check button (initially hidden)
    checkButton = this.add.rectangle(400, 500, 200, 60, 0x4CAF50)
        .setOrigin(0.5)
        .setInteractive()
        .setVisible(false);
    
    const checkText = this.add.text(400, 500, 'Check Answer', 
        { font: '20px Arial', fill: '#FFFFFF' }
    ).setOrigin(0.5);
    
    checkButton.on('pointerdown', () => {
        showFractionQuestion();
        checkButton.setVisible(false);
    });
    
    // Create fraction text (initially hidden)
    fractionText = this.add.text(
        400, 450, 
        'What fraction of the fence is painted?', 
        { 
            font: '24px Arial', 
            fill: '#000000', 
            align: 'center',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        }
    );
    fractionText.setOrigin(0.5).setVisible(false);
    
    // Create feedback text
    feedbackText = this.add.text(
        400, 550, 
        '', 
        { 
            font: '24px Arial', 
            fill: '#000000', 
            align: 'center'
        }
    );
    feedbackText.setOrigin(0.5);
    
    // Pre-create answer buttons (hidden initially)
    const fractions = ['1/10', '2/10', '3/10', '4/10', '5/10', '6/10', '7/10', '8/10', '9/10', '10/10'];
    for (let i = 0; i < fractions.length; i++) {
        const btn = this.add.rectangle(200 + (i % 5) * 120, 480 + Math.floor(i / 5) * 60, 100, 40, 0x2196F3)
            .setOrigin(0.5)
            .setInteractive()
            .setVisible(false);
        
        const btnText = this.add.text(
            btn.x, btn.y, 
            fractions[i], 
            { font: '16px Arial', fill: '#FFFFFF' }
        ).setOrigin(0.5);
        
        btn.on('pointerdown', () => {
            checkAnswer(fractions[i]);
        });
        
        answerButtons.push(btn);
    }
}

function update() {
    // Update logic can go here if needed
}

function togglePlank(plank) {
    const isPainted = plank.getData('painted');
    
    if (isPainted) {
        plank.setFillStyle(0x8B4513); // Brown (unpainted)
        paintedCount--;
    } else {
        plank.setFillStyle(0xFF5722); // Orange (painted)
        paintedCount++;
        
        // Simple paint effect (no sound in this version)
        const particles = this.add.particles('flares');
        const emitter = particles.createEmitter({
            x: plank.x,
            y: plank.y - plankHeight/2 + 20,
            speed: { min: -50, max: 50 },
            angle: { min: 0, max: 180 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'NORMAL',
            active: true,
            lifespan: 500,
            gravityY: 100,
            quantity: 3,
            tint: 0xFF5722
        });
        
        this.time.delayedCall(500, () => {
            emitter.stop();
            particles.destroy();
        });
    }
    
    plank.setData('painted', !isPainted);
    
    // Show check button if at least one plank is painted
    checkButton.setVisible(paintedCount > 0);
    
    // Hide feedback when changing the painting
    feedbackText.setText('');
    hideAnswerButtons();
}

function showFractionQuestion() {
    fractionText.setVisible(true);
    
    // Show answer buttons
    for (let i = 0; i < answerButtons.length; i++) {
        answerButtons[i].setVisible(true);
    }
}

function hideAnswerButtons() {
    fractionText.setVisible(false);
    for (let i = 0; i < answerButtons.length; i++) {
        answerButtons[i].setVisible(false);
    }
}

function checkAnswer(selectedFraction) {
    const correctFraction = `${paintedCount}/10`;
    
    if (selectedFraction === correctFraction) {
        feedbackText.setText('Well done!').setColor('#008000');
        
        // Simple celebration effect
        const particles = this.add.particles('flares');
        const emitter = particles.createEmitter({
            x: 400,
            y: 300,
            speed: { min: -200, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            active: true,
            lifespan: 1000,
            gravityY: 50,
            quantity: 10,
            tint: 0xFFFF00
        });
        
        this.time.delayedCall(1000, () => {
            emitter.stop();
            particles.destroy();
        });
    } else {
        feedbackText.setText(`Try again! Count the painted planks.`).setColor('#FF0000');
    }
}