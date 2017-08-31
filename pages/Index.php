<?php

namespace builder\Pages;

class Index extends \Yard\Page
{
    public $store = ['builder:tree', 'builder:tab'];

    public function mapStore()
    {
        return [
            'tree' => 'builder:tree',
        ];
    }

    public function mapAction()
    {
        return [
            'changeModule' => 'builder:tree.changeModule',
        ];
    }

    public function js()
    {
        return $this->loadFile('Index/Index.js');
    }

    public function css()
    {
        return $this->loadFile('Index/Index.css', 'Index/Font/Font.css');
    }

    public function render()
    {
        return $this->loadFile('Index/Index.html');
    }
}