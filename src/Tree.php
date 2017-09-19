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
        var_dump($path); die();
        $fs = new Filesystem();
        return $fs->remove($path);
    }

    public function copy($from, $to, $overwrite = false, $start = 0)
    {
//        var_dump($from);
//        var_dump($to);
//        var_dump($this->checkFiles($to));
//        die();
        $fs = new Filesystem();
        if($this->checkFiles($to)) {
            return $this->file_copy($fs, $from, $to, $start);
        } else {
            if($overwrite) {
                return $this->file_copy($fs, $from, $to, $start);
            }

            if(count($from) > 1) {
                return 'overwrite-all';
            }
            return 'overwrite';
        }
    }

    public function move($from, $to, $overwrite = false, $start = 0)
    {
        $fs = new Filesystem();
        if($this->checkFiles($to)) {
            return $this->file_move($fs, $from, $to, $start);
        } else {
            if($overwrite) {
                return $this->file_move($fs, $from, $to, $start);
            }

            if(count($from) > 1) {
                return 'overwrite-all';
            }
            return 'overwrite';
        }
    }

    private function checkFiles($locs) {
        $fs = new Filesystem();
        for($i = 0; $i < count($locs); $i++) {
            if($fs->exists($locs[$i])) {
                return false;
            }
        }
        return true;
    }

    private function file_copy($fs, $from, $to, $start) {
        for($i = $start; $i < count($from); $i++) {
            $res = $fs->copy($from[$i], $to[$i], true);
            if(!is_null($res)) {
                return ['i' => $i, 'res' => $res];
            }
        }
        return null;
    }

    private function file_move($fs, $from, $to, $start) {
        for($i = $start; $i < count($from); $i++) {
            $res = $fs->rename($from[$i], $to[$i], true);
            if(!is_null($res)) {
                return ['i' => $i, 'res' => $res];
            }
        }
        return null;
    }
}