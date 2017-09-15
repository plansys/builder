<?php

class treeReducer extends \Yard\Redux\Reducer
{
    public function init()
    {
        return <<<JS
return {
    active: 'pages',
    plansysModules: ['yard','ui','db','user','builder','jasper'],
    rootPath: null,
    selectedItems: [],
    cutItems: [],
    copyItems: [],
    info: {
        pages: {
            module: {
                active: '',
                list: []
            }
        },
        redux: {
            module: {
                active: 'builder',
                list: []
            }
        },
        test: {},
        db: {
            module: {
                active: '',
                list: []
            }
        }
    },
    data: {
        pages: [],
        redux: [],
        db: []
    }
}
JS;
    }

    public function reducers()
    {
        return [
            [
                'type' => 'builder/tree/load',
                'reducer' => 'js: function(state, payload) {
                    let newState = {
                        ...state,
                        active: payload.active
                    };
                    
                    newState.data[payload.active] = payload.data;
                    newState.info[payload.active].module.list = payload.modules;
                    return newState;
                }'
            ],
            [
                'type' => 'builder/tree/updateTree',
                'reducer' => 'js: function(state, payload) {

                    let data = {
                        ...state.data,
                    };                                                   

                    data[payload.active] = payload.data;
                    return {
                        ...state,
                        data
                    }
                }'
            ],
            [
                'type' => 'builder/tree/changeModule',
                'reducer' => 'js: function(state, payload) {
                    let info = {
                        ...state.info,
                    };
                    
                    info[state.active].module.active = payload;
                    return { 
                        ...state,
                        info
                    }
                }'
            ],
            [
                'type' => 'builder/tree/selectItem',
                'reducer' => 'js: function(state, payload) {
                    return { 
                        ...state,
                        selectedItems: payload
                    }
                }'
            ],
            [
                'type' => 'builder/tree/cutItem',
                'reducer' => 'js: function(state, payload) {
                    return { 
                        ...state,
                        cutItems: payload
                    }
                }'
            ],
            [
                'type' => 'builder/tree/copyItem',
                'reducer' => 'js: function(state, payload) {
                    return { 
                        ...state,
                        copyItems: payload
                    }
                }'
            ]
        ];
    }
}