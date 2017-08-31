<?php

namespace builder\Pages\Index;


class Pages extends \Yard\Page
{
    public $store = ['builder:tab'];

    public function mapStore()
    {
        return [
            'tab' => 'builder:tab'
        ];
    }

    public function api($params)
    {
        if (isset($params['action']) && isset($params['active']) && isset($params['info']['module']['active'])) {
            $tabClass = '\Plansys\Builder\Tab\\' . ucfirst($params['active']);
            $tree = new $treeClass($this->app, $this->base, $params['info']['module']['active']);

            switch ($params['action']) {
                case "load":
                    return [
                        'modules' => array_keys($tree->listModule()),
                        'data' => $tree->expand('')
                    ];
                    break;
                case "expand":
                    return $tree->expand(@$params['path']);
                    break;
                case "rename":
                    return $tree->rename($params['path'], $params['name']);
                    break;
                case "delete":
                    return $tree->delete($params['path']);
                    break;
                case "copy":
                    return $tree->copy($params['from'], $params['from']);
                    break;
                case "move":
                    return $tree->move($params['from'], $params['from']);
                    break;
                case "search":
                    return $tree->search($params['text'], @$params['path']);
                    break;
            }
        }
    }

    public function js()
    {
        return $this->loadFile('Pages/Pages.js');
    }

    public function css()
    {
        return $this->loadFile('Pages/Pages.css');
    }

    public function render()
    {
        return $this->loadFile('Pages/Pages.html');
    }
}