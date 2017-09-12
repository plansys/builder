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
                    $result = $tree->rename($params['path'], $params['name']);
                    return $this->after_file_operation($result, $tree, @$params['path']);
                    break;
                case "delete":
                    $result = $tree->delete($params['path']);
                    return $this->after_file_operation($result, $tree, @$params['path']);
                    break;
                case "copy":
                    $result = $tree->copy($params['from'], $params['to']);
                    return $this->after_file_operation($result, $tree, @$params['path']);
                    break;
                case "move":
                    $result = $tree->move($params['from'], $params['to']);
                    return $this->after_file_operation($result, $tree, @$params['path']);
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

    private function after_file_operation($result, $tree, $path) {
        switch ($result) {
            case 'ok':
                return $tree->expand($path);
                break;
            default:
                return $result;
                break;
        }
    }
}