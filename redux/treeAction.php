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
        ];
    }
}