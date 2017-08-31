<?php

namespace builder\Pages\Index;


class Tree extends \Yard\Page
{
    public $store = ['builder:tree', 'builder:tab'];

    public function mapStore()
    {
        return [
            'tree' => 'builder:tree'
        ];
    }

    public function mapAction()
    {
        return [
            'load' => 'builder:tree.load',
            'updateTree' => 'builder:tree.updateTree',
            'openTab' => 'builder:tab.openTab',
            'updateTab' => 'builder:tab.updateTab'
        ];
    }

    public function api($params)
    {
        if (isset($params['action']) && isset($params['active']) && isset($params['info']['module']['active'])) {
            $treeClass = '\Plansys\Builder\Tree\\' . ucfirst($params['active']);
            $tree = new $treeClass($this->app, $this->base, $params['info']['module']['active']);
            $tabClass = '\Plansys\Builder\Tab\\' . ucfirst($params['active']);

            switch ($params['action']) {
                case "load":
                    return [
                        'modules' => array_keys($tree->listModule()),
                        'data' => $tree->expand('')
                    ];
                    break;
                case "open":
                    $tab = new $tabClass($this->app, $this->base, $params['info']['module']['active'],
                        $params['itemLabel'], $params['itemPath']);
                    return $tab->open();
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
        return $this->loadFile('Tree/Tree.js');
    }

    public function css()
    {
        return $this->loadFile('Tree/Tree.css');
    }

    public function render()
    {
        return $this->loadFile('Tree/Tree.html');
    }
}