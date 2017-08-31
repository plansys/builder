<?php

namespace Plansys\Builder\Module\Pages;

trait Js
{
    private $js;

    public function getJs()
    {
        $this->js = $this->instance->js();
        return $this->js;
    }

    public function setJs($js)
    {
        $this->js = $js;
        $this->ast->methods['js']['code'] = $js;
    }

}