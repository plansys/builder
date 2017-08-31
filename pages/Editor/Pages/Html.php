<?php

namespace builder\Pages\Editor\Pages;


class Html extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('Html/Html.js');
    }

    public function css()
    {
        return $this->loadFile('Html/Html.css');
    }

    public function render()
    {
        return $this->loadFile('Html/Html.html');
    }
}