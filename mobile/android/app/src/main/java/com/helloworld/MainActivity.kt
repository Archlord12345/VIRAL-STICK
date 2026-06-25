package com.helloworld

import android.content.Intent // ◄ Import requis pour le transfert de partage
import android.os.Bundle // ◄ Import requis pour la stabilisation de l'application
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ViralStick"

  /**
   * CONFIGURATION DE SÉCURITÉ : Règle le problème du redémarrage de l'application
   * en forçant Android à ignorer la destruction de l'activité en arrière-plan.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }

  /**
   * CAPTEUR DE PARTAGE EXTERNE : Intercepte l'image ou le texte partagé depuis 
   * la galerie ou WhatsApp et le transmet instantanément au moteur JavaScript.
   */
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

