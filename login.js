var granimInstance = new Granim({
    element: '#bg-canvas',
    direction: 'top-bottom',
    isPausedWhenNotInView: true,
    image : {
        source: theme.template_dir + '/assets/images/login-bg.jpg',
        blendingMode: 'multiply',
        stretchMode: [ 'stretch-if-smaller','stretch-if-smaller']
    },
    states : {
        "default-state": {
            gradients: [
            	['#4B7D62', '#4BFD9F'],
                ['#585858', '#AEAEAE']

            ],
            transitionSpeed: 7000
        }
    }
});