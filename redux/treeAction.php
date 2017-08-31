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
            'openTab' => [
                'type' => "builder/tab/openTab",
                'params' => "payload",
                'payload' => "payload"
            ],
        ];
    }
}