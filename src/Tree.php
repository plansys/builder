<?php

namespace Plansys\Builder;

use Symfony\Component\Filesystem\Filesystem;

abstract class Tree
{
    public abstract function expand($path);

    public abstract function listModule();

    public function rename($path, $name)
    {
        $fs = new Filesystem();
        $fs->rename($path, dirname($path) . DIRECTORY_SEPARATOR . $name);
    }

    public function delete($path)
    {
        $fs = new Filesystem();
        $fs->remove($path);
    }

    public function copy($from, $to)
    {
        $fs = new Filesystem();
        $fs->copy($from, $to);
    }

    public function move($from, $to)
    {
        $fs = new Filesystem();
        $fs->rename($from, $to);
    }
}