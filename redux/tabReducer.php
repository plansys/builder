<?php

class tabReducer extends \Yard\Redux\Reducer
{
    public function init()
    {
        return <<<JS
return {
    data: [ {
        type: 'pages',
        active: false,
        saved: true,
        label: 'Page1',
        tree: {},
        history: [],
        content: [
            {
                type: 'html',
                active: false,
                file: null,
                value: '<div class="test">Content</div>'
            },
            {
                type: 'js',
                active: false,
                file: null,
                value: 'this.load = (ref) => { return true; }'
            },
            {
                type: 'css',
                active: false,
                file: null,
                value: ''
            },
            {
                type: 'setting',
                active: false,
                value: []
            },
            {
                type: 'redux',
                active: false,
                value: []
            }
        ]
    } ]
}
JS;
    }

    public function reducers()
    {
        return [
            [
                'type' => 'builder/tab/openTab',
                'reducer' => 'js: function(state, payload) {
                    let data = {
                        ...state.data,
                    };
                    data.push(payload);
                    
                    return {
                        ...state,
                        data
                    }
                }'
            ],
            [
                'type' => 'builder/tab/updateTab',
                'reducer' => 'js: function(state, payload) {
                    let data = {
                        ...state.data,
                    };
                    data = payload.data;
                    
                    return {
                        ...state,
                        data
                    }
                }'
            ],
        ];
    }
}