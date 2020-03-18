!macro customHeader
    ; a comment
    ShowInstDetails show
    ShowUninstDetails show
    SetDetailsPrint both
    !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
!macroend

!macro customInit
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInit"
!macroend

!macro customInstall
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
  DetailPrint "Installing dirgistered ..."
!macroend
