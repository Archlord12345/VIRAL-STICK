if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/home/ravel/.gradle/caches/8.14.3/transforms/6c5a3fa2d8f511ae2bc7b263c7b21ddf/transformed/hermes-android-250829098.0.14-release/prefab/modules/hermesvm/libs/android.x86/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/ravel/.gradle/caches/8.14.3/transforms/6c5a3fa2d8f511ae2bc7b263c7b21ddf/transformed/hermes-android-250829098.0.14-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

