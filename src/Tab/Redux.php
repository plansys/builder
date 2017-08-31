<?php

namespace Plansys\Builder\Tab;

use Plansys\Builder\Module;
use Plansys\Builder;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class Redux extends Tab
{
    public $base;
    public $moduleName;
    public $module;

    function __construct($app, $base)
    {
        if (is_object($base) && get_class($base) == 'Yard\Base') {
            $this->base = $base;
        } else {
            throw new \Exception('Base must be an Yard\Base instance');
        }
    }

    public function open() {

    }

    public function save() {
        
    }
}