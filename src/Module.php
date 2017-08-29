<?php

namespace Plansys\Builder;

use Plansys\Builder\Module\Page;
use Plansys\Codegen\ConfigCode;
use Symfony\Component\Filesystem\Filesystem;

class Module
{
    public $name = '';
    public $current;

    public $base;
    public $baseConfig;

    public $loaded = false;
    public $system = false;

    function __construct($base, $moduleName = '', $eagerLoad = true)
    {
        if (get_class($base) != 'Yard\Base') {
            throw new \Exception('Base should be an instance \Yard\Base class');
        }

        $this->base = $base;
        $this->name = $moduleName == '' ? 'default' : strtolower($moduleName);
        $this->current = $this->base->modules[$moduleName];

        $baseDir = realpath(dirname($this->base->baseFile));
        $inUserModuleDir = strpos(realpath($this->current['dir']), $baseDir . DIRECTORY_SEPARATOR . 'modules');
        if ($moduleName != '' && $inUserModuleDir === false) {
            $this->system = true;
        }

        if ($eagerLoad) {
            $this->reload($moduleName);
        }
    }

    public function reload($moduleName)
    {
        if (isset($this->base->modules[$moduleName])) {
            $this->loaded = true;
            $this->current = $this->base->modules[$moduleName];
            $this->baseConfig = new ConfigCode($this->base->baseFile);
            return true;
        } else {
            throw new \Exception("Module $moduleName not found in base!");
        }
    }

    public function getAll()
    {
        if (get_class($this->base) != 'Yard\Base') {
            throw new \Exception('Base should be an instance \Yard\Base class');
        }

        if (!is_array($this->base->modules)) {
            throw new \Exception('Base array should have a module key');
        }

        $result = [];
        foreach ($this->base->modules as $name => $module) {
            $result[] = $name;
        }
        return $result;
    }

    public function createPage($pageName, $path = '')
    {
        $page = new Page($this->name, $this->current, $pageName, $path);
        $page->save();
        return $page;
    }

    public function loadPage($pageName, $path = '')
    {
        return new Page($this->name, $this->current, $pageName, $path);
    }

    public function createRedux($storeName, $path = '')
    {

    }

    public function create($moduleName)
    {
        $fs = new Filesystem();
        $baseDir = dirname($this->base->baseFile);
        $pageDir = '/modules/' . $moduleName . '/pages';
        $reduxDir = '/modules/' . $moduleName . '/redux';
        $url = '/modules/' . $moduleName . '/redux';

        if ($fs->exists($baseDir . $pageDir)) {
            $dir = glob($baseDir . $pageDir . DIRECTORY_SEPARATOR . '*');
            if (!empty($dir)) {
                throw new \Exception("Can't create new module, directory {$baseDir}{$pageDir} is not empty!");
            }

            if (!is_writeable($baseDir . $pageDir)) {
                throw new \Exception("Directory {$baseDir}{$pageDir} is not writable!");
            }
        } else {
            $fs->mkdir($baseDir . $pageDir);
        }

        if ($fs->exists($baseDir . $reduxDir)) {
            $dir = glob($baseDir . $reduxDir . DIRECTORY_SEPARATOR . '*');
            if (!empty($dir)) {
                throw new \Exception("Can't create new module, directory {$baseDir}{$reduxDir} is not empty!");
            }

            if (!is_writeable($baseDir . $reduxDir)) {
                throw new \Exception("Directory {$baseDir}{$reduxDir} is not writable!");
            }
        } else {
            $fs->mkdir($baseDir . $reduxDir);
        }

        $modules = $this->baseConfig->get('modules');
        if (isset($modules[$moduleName])) {
            throw new \Exception("Module $moduleName already exists");
        } else {
            $code = <<<PHP
    [
        'dir' => dirname(__FILE__) . '$pageDir',
        'redux' => dirname(__FILE__) . '$reduxDir',
        'url' => \$host . '$url'
    ];
PHP;
            $this->baseConfig->set('modules.' . $moduleName, $code, 'true');
        }
    }

    public function rename($from, $to)
    {
        if ($this->baseConfig->get('modules.' . $from)) {
            $this->delete($from);
            $this->create($to);

            $fs = new Filesystem();
            $oldDir = dirname($this->base->baseFile) . '/modules/' . $from;
            $newDir = dirname($this->base->baseFile) . '/modules/' . $to;
            $fs->remove($newDir);
            $fs->rename($oldDir, $newDir);
        }
    }

    public function delete($moduleName)
    {
        $this->baseConfig->remove('modules.' . $moduleName);
    }

}