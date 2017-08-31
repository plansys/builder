<?php

namespace Plansys\Builder\Module\Pages;

trait Redux
{
    private $redux;

    public function getRedux()
    {
        return [];
    }

    public function setRedux($redux)
    {
        $this->redux = $redux;
    }

}