<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInite81eb9a160b3c0d1f5bbce6b6ad7a781
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        require __DIR__ . '/platform_check.php';

        spl_autoload_register(array('ComposerAutoloaderInite81eb9a160b3c0d1f5bbce6b6ad7a781', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInite81eb9a160b3c0d1f5bbce6b6ad7a781', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInite81eb9a160b3c0d1f5bbce6b6ad7a781::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}
