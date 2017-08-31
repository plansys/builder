<?php

namespace builder\Pages\Editor\Pages;


class Redux extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('Redux/Redux.js');
    }

    public function css()
    {
        return $this->loadFile('Redux/Redux.css');
    }

    public function render()
    {
        return $this->loadFile('Redux/Redux.html');
    }
}