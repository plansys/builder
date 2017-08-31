<?php

namespace builder\Pages\Editor\Pages;


class Setting extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('Setting/Setting.js');
    }

    public function css()
    {
        return $this->loadFile('Setting/Setting.css');
    }

    public function render()
    {
        return $this->loadFile('Setting/Setting.html');
    }
}