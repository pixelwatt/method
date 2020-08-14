var granimInstance = new Granim({
    element: '#bg-canvas',
    direction: 'top-bottom',
    isPausedWhenNotInView: true,
    image : {
        source: theme.template_dir + '/assets/images/login-bg.jpg',
        blendingMode: 'screen',
        stretchMode: [ 'stretch-if-smaller','stretch-if-smaller']
    },
    states : {
        "default-state": {
            gradients: [
            	['#dcc9d7', '#f5cfc5'],
            	['#ffaf89', '#925d7a']
            ],
            transitionSpeed: 7000
        }
    }
});