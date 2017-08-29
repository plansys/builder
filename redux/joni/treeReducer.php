<?php

class treeReducer extends \Yard\Redux\Reducer
{
    public function init()
    {
        return <<<JS
return {
    active: 'redux',
    info: {
        page: {
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
        db: {
            module: {
                active: '',
                list: []
            }
        }
    },
    data: {
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
        ];
    }
}