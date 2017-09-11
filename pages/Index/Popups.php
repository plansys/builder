<?php

namespace builder\Pages\Index;


class Popups extends \Yard\Page
{
    public function js()
    {
        return $this->loadFile('Popups/Popups.js');
    }

    public function css()
    {
        return $this->loadFile('Popups/Popups.css');
    }

    public function render()
    {
        return '<div>' . $this->loadFile(
//            'Popups/CreateModule.html',
            'Popups/CreatePage.html'
        ) . '</div>';
    }
}