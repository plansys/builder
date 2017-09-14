<?php

class tabAction extends \Yard\Redux\Action {
    public function actionCreators() {
        return [
            'openTab' => [
                'type' => "builder/tab/openTab",
                'params' => "payload",
                'payload' => "payload"
            ],
            'updateTabs' => [
                'type' => "builder/tab/updateTabs",
                'params' => "payload",
                'payload' => "payload"
            ],
        ];
    }
}