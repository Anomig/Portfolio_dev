document.addEventListener('DOMContentLoaded', () => {
    const webcamElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('canvas');
    const captureButton = document.getElementById('capture-button');
    const resultContainer = document.getElementById('result-container');
    const webcam = new Webcam(webcamElement, 'user', canvasElement);
    let model;

    // Load the MobileNet model
    mobilenet.load().then(loadedModel => {
        model = loadedModel;
        console.log('MobileNet model loaded');
    });

    // Start the webcam
    webcam.start()
        .then(() => {
            console.log('Webcam started');
        })
        .catch(err => {
            console.error('Error starting webcam', err);
        });

    // Capture the image and classify it
    captureButton.addEventListener('click', () => {
        const picture = webcam.snap();
        const imageElement = new Image();
        imageElement.src = picture;

        imageElement.onload = () => {
            model.classify(imageElement).then(predictions => {
                console.log('Predictions: ', predictions);
                resultContainer.innerHTML = predictions.map(p => `
                    <p>${p.className}: ${(p.probability * 100).toFixed(2)}%</p>
                `).join('');
            });
        };
    });
});
