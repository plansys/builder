<?php

namespace Plansys\Builder\Module;

class Page
{
    public $base;
    public $code;

    public function __construct($base)
    {
        $this->base = $base;
    }

    public static function all()
    {
        return [];
    }

    public static function load($module, $path)
    {

    }

}