!macro customHeader
  # !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
!macroend

!macro preInit
  ; This macro is inserted at the beginning of the NSIS .OnInit callback
  # !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
!macroend

!macro customInit
  # !system "echo '' > ${BUILD_RESOURCES_DIR}/customInit"
!macroend

!macro customInstall
  # !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
  SetRegView 64
  # Code
  SetRegView 32
  # Code
!macroend

!macro customUnInstall
  !system "echo 'Hehe'"
!macroend

!macro customInstallMode
  # set $isForceMachineInstall or $isForceCurrentInstall 
  # to enforce one or the other modes.
!macroend
