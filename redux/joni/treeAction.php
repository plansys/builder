<?php

class treeAction extends \Yard\Redux\Action {
    public function actionCreators() {
        return [
            'load' => [
                'type' => "builder/tree/load",
                'params' => "payload",
                'payload' => "payload"
            ],
        ];
    }
}