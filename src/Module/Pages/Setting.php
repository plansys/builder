<?php

namespace Plansys\Builder\Module\Pages;

trait Setting
{
    private $setting;

    public function getSetting()
    {
        return [];
    }

    public function setSetting($setting)
    {
        $this->setting = $setting;
    }

}