<?php

namespace builder\Pages\Index;


class Tab extends \Yard\Page
{
    public $store = ['builder:tab'];

    public function mapStore()
    {
        return [
            'tab' => 'builder:tab'
        ];
    }

    public function mapAction()
    {
        return [
            'openTab' => 'builder:tab.openTab',
            'updateTabs' => 'builder:tab.updateTabs',
        ];
    }

    public function api($params)
    {
        if (isset($params['action'])) {
            $tabClass = '\Plansys\Builder\Module\\' . ucfirst($params['active']);
            $tab = new $tabClass($this->app, $this->base);

            switch ($params['action']) {
                case "open":
                    return $tab->open(@$params['tree']);
                    break;
                case "save":
                    return $tab->save(@$params['tab']);
                    break;
            }
        }
    }

    public function js()
    {
        return $this->loadFile('Tab/Tab.js');
    }

    public function css()
    {
        return $this->loadFile('Tab/Tab.css');
    }

    public function render()
    {
        return $this->loadFile('Tab/Tab.html');
    }
}