<?php

namespace builder\Pages\Editor\Pages;


class Css extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('Css/Css.js');
    }

    public function css()
    {
        return $this->loadFile('Css/Css.css');
    }

    public function render()
    {
        return $this->loadFile('Css/Css.html');
    }
}