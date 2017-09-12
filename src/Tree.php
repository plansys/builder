<?php

namespace Plansys\Builder;

use Symfony\Component\Filesystem\Filesystem;

abstract class Tree
{
    public abstract function expand($path);

    public abstract function listModule();

    public function createPage($pageName, $path = '')
    {
        $module = new Module($this->base, $this->moduleName);
        $module->createPage($pageName, $path);
    }

    public function createDir($dirName, $path = '')
    {
        $rootPath = realpath($this->module['dir']);
        if ($path == '') {
            $path = '/';
        } else {
            $path = trim('/', $path);
        }
        $path = str_replace("/", DIRECTORY_SEPARATOR, $path);
        $dirPath = $rootPath . $path . $dirName;

        $fs = new Filesystem();
        $fs->mkdir($dirPath);
    }

    public function rename($path, $name)
    {
        $fs = new Filesystem();
        return $fs->rename($path, dirname($path) . DIRECTORY_SEPARATOR . $name);
    }

    public function delete($path)
    {
        $fs = new Filesystem();
        return $fs->remove($path);
    }

    public function copy($from, $to)
    {
        $fs = new Filesystem();
        if(!$fs->exists($to)) {
            return $fs->copy($from, $to);
        } else {
            return 'overwrite';
        }
    }

    public function move($from, $to)
    {
        $fs = new Filesystem();
        if(!$fs->exists($to)) {
            return $fs->rename($from, $to);
        } else {
            return 'overwrite';
        }
    }
}