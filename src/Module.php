<?php

namespace Plansys\Builder;

use PhpParser\Node\Scalar\MagicConst\File;
use Plansys\Builder\Module\Page;
use Plansys\Builder\Module\Redux;
use Symfony\Component\Filesystem\Filesystem;

class Module
{
    public $pages;
    public $reduxes;
    public $base;
    public $info;

    function __construct($base, $moduleName = '')
    {
        if (!is_array($base)) {
            throw new \Exception('Base should be an array');
        }

        if (!is_array($base['modules'])) {
            throw new \Exception('Base array should have a module key');
        }

        $this->base = $base;
        $this->info = $base['modules']['moduleName'];

        $this->pages = Page::all($this);
        $this->reduxes = Redux::all($this);
    }

    public static function all($base)
    {
        if (!is_array($base)) {
            throw new \Exception('Base should be an array');
        }

        if (!is_array($base['modules'])) {
            throw new \Exception('Base array should have a module key');
        }

        $result = [];
        foreach ($base['modules'] as $name => $module) {
            $result[$name] = new Module($base, $name);
        }
    }

    public static function create($pageDir, $reduxDir, $url) {
        $fs = new Filesystem();

        if ($fs->exists($pageDir)) {
            throw new \Exception("Can't create new modoule, directory {$pageDir} already exists!");
        }

        if ($fs->exists($reduxDir)) {
            throw new \Exception("Can't create new modoule, directory {$pageDir} already exists!");
        }

        $fs->mkdir($pageDir);
        $fs->mkdir($reduxDir);




    }

    public static function rename($from, $to) {

    }

    public static function delete($name) {

    }

}