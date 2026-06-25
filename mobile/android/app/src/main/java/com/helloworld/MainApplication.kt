package com.helloworld

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : ReactNativeHost(this) {

        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
        
        // Toutes les lignes d'override invalides ont été supprimées d'ici
      }

  override fun onCreate() {
    super.onCreate()

    // SAFE init SoLoader (RN 0.75)
    SoLoader.init(this, false)
  }
}

