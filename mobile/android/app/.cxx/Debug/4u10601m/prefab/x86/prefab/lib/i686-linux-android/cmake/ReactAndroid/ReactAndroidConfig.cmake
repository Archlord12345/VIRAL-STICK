if(NOT TARGET ReactAndroid::hermestooling)
add_library(ReactAndroid::hermestooling SHARED IMPORTED)
set_target_properties(ReactAndroid::hermestooling PROPERTIES
    IMPORTED_LOCATION "/home/ravel/.gradle/caches/8.14.3/transforms/2172371b1620b17005706f245b90911f/transformed/react-android-0.86.0-debug/prefab/modules/hermestooling/libs/android.x86/libhermestooling.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/ravel/.gradle/caches/8.14.3/transforms/2172371b1620b17005706f245b90911f/transformed/react-android-0.86.0-debug/prefab/modules/hermestooling/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::jsi)
add_library(ReactAndroid::jsi SHARED IMPORTED)
set_target_properties(ReactAndroid::jsi PROPERTIES
    IMPORTED_LOCATION "/home/ravel/.gradle/caches/8.14.3/transforms/2172371b1620b17005706f245b90911f/transformed/react-android-0.86.0-debug/prefab/modules/jsi/libs/android.x86/libjsi.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/ravel/.gradle/caches/8.14.3/transforms/2172371b1620b17005706f245b90911f/transformed/react-android-0.86.0-debug/prefab/modules/jsi/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

if(NOT TARGET ReactAndroid::reactnative)
add_library(ReactAndroid::reactnative SHARED IMPORTED)
set_target_properties(ReactAndroid::reactnative PROPERTIES
    IMPORTED_LOCATION "/home/ravel/.gradle/caches/8.14.3/transforms/2172371b1620b17005706f245b90911f/transformed/react-android-0.86.0-debug/prefab/modules/reactnative/libs/android.x86/libreactnative.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/ravel/.gradle/caches/8.14.3/transforms/2172371b1620b17005706f245b90911f/transformed/react-android-0.86.0-debug/prefab/modules/reactnative/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

