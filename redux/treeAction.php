<?php

class treeAction extends \Yard\Redux\Action {
    public function actionCreators() {
        return [
            'load' => [
                'type' => "builder/tree/load",
                'params' => "payload",
                'payload' => "payload"
            ],
            'updateTree' => [
                'type' => "builder/tree/updateTree",
                'params' => "payload",
                'payload' => "payload"
            ],
            'changeModule' => [
                'type' => "builder/tree/changeModule",
                'params' => "payload",
                'payload' => "payload"
            ],
            'selectItem' => [
                'type' => "builder/tree/selectItem",
                'params' => "payload",
                'payload' => "payload"
            ],
            'cutItem' => [
                'type' => "builder/tree/cutItem",
                'params' => "payload",
                'payload' => "payload"
            ],
            'copyItem' => [
                'type' => "builder/tree/copyItem",
                'params' => "payload",
                'payload' => "payload"
            ]
        ];
    }
}