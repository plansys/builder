<?php

namespace Plansys\Builder\Tree;

use Plansys\Builder\Module;
use Plansys\Builder\Tree;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class Pages extends Tree
{
    public $base;
    public $moduleName;
    public $module;

    function __construct($app, $base, $moduleName = '')
    {
        if (is_object($base) && get_class($base) == 'Yard\Base') {
            $this->base = $base;
            $this->moduleName = $moduleName;
            if (isset($this->base->modules[$moduleName])) {
                $this->module = $this->base->modules[$moduleName];
            } else {
                throw new \Exception("Module {$moduleName} does not exists");
            }
        } else {
            throw new \Exception('Base must be an Yard\Base instance');
        }
    }

    public function listModule()
    {
        $list = [];
        foreach ($this->base->modules as $key => $module) {
            $list[$key] = $module;
        }

        return $list;
    }

    public function expand($path = '')
    {
        if ($path != '' && $path[0] != DIRECTORY_SEPARATOR) {
            $path = DIRECTORY_SEPARATOR . $path;
        }

        $basePath = $this->module['dir'] . $path;
        $basePath = str_replace('/', DIRECTORY_SEPARATOR, $basePath);
        $basePath = realpath($basePath);
        $rootPath = realpath($this->module['dir']);

        $results = [];
        $finder = new Finder();
        $finder->directories()->in($basePath);
        $finder->depth(0);
        foreach ($finder as $f) {
            if (strpos($f->getFilename(), '_') === 0) continue;

            $results[] = [
                'path' => str_replace($rootPath, "", $f->getPath()),
                'label' => str_replace(".php", "", $f->getFilename()),
                'hasChild' => $f->isDir(),
                'info' => [
                    'relativePath' => $f->getRelativePath(),
                    'relativePathname' => $f->getRelativePathname(),
                    'pathName' => $f->getPathname(),
                    'fileName' => $f->getFilename(),
                    'ext' => $f->getExtension()
                ]
            ];
        }

        $finder = new Finder();
        $finder->files()->name('*.php')->in($basePath);
        $finder->depth(0);
        foreach ($finder as $f) {
            if (strpos($f->getFilename(), '_') === 0) continue;

            $results[] = [
                'path' => str_replace($rootPath, "", $f->getPath()),
                'label' => str_replace(".php", "", $f->getFilename()),
                'hasChild' => $f->isDir(),
                'info' => [
                    'relativePath' => $f->getRelativePath(),
                    'relativePathname' => $f->getRelativePathname(),
                    'pathName' => $f->getPathname(),
                    'fileName' => $f->getFilename(),
                    'ext' => $f->getExtension()
                ]
            ];
        }

        return $results;
    }
}