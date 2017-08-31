<?php

namespace Plansys\Builder\Module\Pages;

trait Html
{
    private $html;

    public function getHtml()
    {
        $this->html = $this->instance->render();
        return $this->html;
    }

    public function setHtml($html)
    {
        $this->html = $html;
        $this->ast->methods['render']['code'] = $html;
    }

}