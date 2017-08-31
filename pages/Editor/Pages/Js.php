<?php

namespace builder\Pages\Editor\Pages;


class Js extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('Js/Js.js');
    }

    public function css()
    {
        return $this->loadFile('Js/Js.css');
    }

    public function render()
    {
        return $this->loadFile('Js/Js.html');
    }
}