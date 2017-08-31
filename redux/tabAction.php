<?php

class tabAction extends \Yard\Redux\Action {
    public function actionCreators() {
        return [
            'openTab' => [
                'type' => "builder/tab/openTab",
                'params' => "payload",
                'payload' => "payload"
            ],
            'updateTab' => [
                'type' => "builder/tab/updateTab",
                'params' => "payload",
                'payload' => "payload"
            ],
        ];
    }
}