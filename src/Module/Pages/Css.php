<?php

namespace Plansys\Builder\Module\Pages;

trait Css
{
    private $css;

    public function getCss()
    {
        $this->css = $this->instance->css();
        return $this->css;
    }

    public function setCss($css)
    {
        $this->css = $css;
        $this->ast->methods['css']['code'] = $css;
    }

}