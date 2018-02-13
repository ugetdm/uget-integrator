cmake_minimum_required(VERSION 3.5)
 
PROJECT(uget-integrator)

set(MAJOR_VERSION 0)
set(MINOR_VERSION 0)
set(PATCH_VERSION 1)
set(RELEASE_VERSION 1)
set(VERSION ${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION})
set(DESCRIPTION "Integrate uGet Download manager with Google Chrome, Chromium, Vivaldi, Opera and Firefox")
set(HOME_PAGE "http://ugetdm.com/")
set(UBUNTU_BUILD_TARGET "xenial")
set(EMBEDDABLE_PYTHON "python-3.6.4")
set(EMBEDDABLE_PYTHON_URL "https://www.python.org/ftp/python/3.6.4/python-3.6.4-embed-amd64.zip")
set(EMBEDDABLE_PYTHON_MD5 "d2fb546fd4b189146dbefeba85e7266b")

# Ubuntu
install(FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/bin/uget-integrator
    DESTINATION /bin
    COMPONENT ubuntu
)
install(FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/conf/com.ugetdm.chrome.json
    ${CMAKE_CURRENT_SOURCE_DIR}/conf/com.ugetdm.firefox.json
    DESTINATION /conf
    COMPONENT ubuntu
)

# Windows portable ZIP
install(FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/bin/uget-integrator
    ${CMAKE_CURRENT_SOURCE_DIR}/install/windows/add_config.bat
    ${CMAKE_CURRENT_SOURCE_DIR}/install/windows/remove_config.bat
    ${CMAKE_CURRENT_SOURCE_DIR}/install/windows/uget-integrator.bat
    ${CMAKE_CURRENT_SOURCE_DIR}/LICENSE
    DESTINATION /
    COMPONENT win_portable
)

# Windows installer
install(FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/bin/uget-integrator
    ${CMAKE_CURRENT_SOURCE_DIR}/install/windows/uget-integrator.nsi
    ${CMAKE_CURRENT_SOURCE_DIR}/install/windows/uget-integrator.bat
    ${CMAKE_CURRENT_SOURCE_DIR}/install/windows/icon.ico
    ${CMAKE_CURRENT_SOURCE_DIR}/LICENSE
    DESTINATION /
    COMPONENT win_installer
)

# Download Python
file(WRITE ${CMAKE_CURRENT_BINARY_DIR}/download_python.cmake
  "set(downloaded_file \"${CMAKE_CURRENT_BINARY_DIR}/${EMBEDDABLE_PYTHON}.zip\")\n"
  "set(url \"${EMBEDDABLE_PYTHON_URL}\")\n"
  "set(expected_hash \"${EMBEDDABLE_PYTHON_MD5}\")\n"

  "if (EXISTS \${downloaded_file})\n"
  "  file(MD5 \${downloaded_file} filehash)\n"
  "  message(\"\${downloaded_file} exists with hash: \" \${filehash})\n"
  "  if (\${expected_hash} STREQUAL \${filehash})\n"
  "    message(\"Hash matches expected hash.\")\n"
  "  else()\n"
  "    message(\"Hash does not match expected hash.\")\n"
  "    file(DOWNLOAD \${url} \${downloaded_file} SHOW_PROGRESS)\n"
  "  endif()\n"
  "else()\n"
  "  message(\"\${downloaded_file} missing.\")\n"
  "  file(DOWNLOAD \${url} \${downloaded_file} SHOW_PROGRESS)\n"
  "endif()\n"
)

add_custom_command(OUTPUT "${CMAKE_CURRENT_BINARY_DIR}/${EMBEDDABLE_PYTHON}.zip"
  COMMAND ${CMAKE_COMMAND} -P "${CMAKE_CURRENT_BINARY_DIR}/download_python.cmake"
  WORKING_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}"
  DEPENDS "${CMAKE_CURRENT_BINARY_DIR}/download_python.cmake"
  COMMENT "Downloading embeddable Python for Windows packages."
  VERBATIM
)

add_custom_target(python_download ALL DEPENDS "${CMAKE_CURRENT_BINARY_DIR}/${EMBEDDABLE_PYTHON}.zip")

# Making target for Ubuntu
function(make_ubuntu_target COMPONENT)
    if( COMPONENT )
        set(TMP_COMPONENT ${COMPONENT})
        set(COMPONENT "_${COMPONENT}")

        # Install target for component
        add_custom_target(install${COMPONENT}
            COMMAND
             "${CMAKE_COMMAND}" -DCMAKE_INSTALL_COMPONENT=${TMP_COMPONENT}
             -P "${CMAKE_BINARY_DIR}/cmake_install.cmake"
        )
    endif()

    set(TMP_PACKAGE_DIR "${CMAKE_BINARY_DIR}/${TMP_COMPONENT}/${CMAKE_PROJECT_NAME}")
    set(TMP_PACKAGE_DEB_DIR "${TMP_PACKAGE_DIR}/debian")

    # Create control file
    set(GEN_CONTROL_LIST
        "Source: ${CMAKE_PROJECT_NAME}"
        "Section: utils"
        "Priority: optional"
        "Maintainer: Gobinath Loganathan <slgobinath@gmail.com>"
        "Build-Depends: debhelper (>= 9)"
        "Standards-Version: 3.9.6"
        "Homepage: ${HOME_PAGE}\\n"
        "Package: ${CMAKE_PROJECT_NAME}"
        "Architecture: any"
        "Depends: uget (>= 2.0.2), python3 (>= 3.4.0)"      
        "Description: ${CMAKE_PROJECT_NAME}\\n  ${DESCRIPTION}"
    )

    # Create install file
    set(GEN_INSTALL
        "bin/uget-integrator /usr/bin"
        "conf/com.ugetdm.chrome.json /etc/opt/chrome/native-messaging-hosts"
        "conf/com.ugetdm.chrome.json /etc/chromium/native-messaging-hosts"
        "conf/com.ugetdm.firefox.json /usr/lib/mozilla/native-messaging-hosts"
        "conf/com.ugetdm.firefox.json /usr/lib64/mozilla/native-messaging-hosts"
    )

    # Create rules file
    set(GEN_RULES
        "#!/usr/bin/make -f"
        "%:"
        "	dh $@ "
    )

    # Create rules file
    set(CHANGE_LOG_HEADER
        "${CMAKE_PROJECT_NAME} (${VERSION}-${RELEASE_VERSION}) ${UBUNTU_BUILD_TARGET}\; urgency=medium\\n"
    )

    # Create compat value
    set(COMPAT_VAL "9")

    string(REPLACE ";" "\\n" GEN_CONTROL_STR "${GEN_CONTROL_LIST}")
    string(REPLACE ";" "\\n" GEN_RULES_STR "${GEN_RULES}")
    string(REPLACE ";" "\\n" GEN_INSTALL_STR "${GEN_INSTALL}")

    set(PACKAGE_FILENAME "${CMAKE_BINARY_DIR}/${CMAKE_PROJECT_NAME}_${VERSION}-${RELEASE_VERSION}.deb")

    # Build package target for component
    add_custom_target(deb_package${COMPONENT}
        COMMAND rm -rf ${TMP_PACKAGE_DIR}
        COMMAND mkdir -p ${TMP_PACKAGE_DEB_DIR}
        COMMAND echo ${GEN_CONTROL_STR} > ${TMP_PACKAGE_DEB_DIR}/control
        COMMAND echo ${GEN_RULES_STR} > ${TMP_PACKAGE_DEB_DIR}/rules
        COMMAND echo ${GEN_INSTALL_STR} > ${TMP_PACKAGE_DEB_DIR}/install
        COMMAND echo ${COMPAT_VAL} > ${TMP_PACKAGE_DEB_DIR}/compat
        COMMAND echo ${CHANGE_LOG_HEADER} > ${TMP_PACKAGE_DEB_DIR}/changelog
        COMMAND cat ${CMAKE_CURRENT_SOURCE_DIR}/changelog >> ${TMP_PACKAGE_DEB_DIR}/changelog
        COMMAND cat ${CMAKE_CURRENT_SOURCE_DIR}/copyright >> ${TMP_PACKAGE_DEB_DIR}/copyright
        COMMAND test -z "${DEB_PACKAGE${COMPONENT}_CONTROL_FILES}" || cp ${DEB_PACKAGE${COMPONENT}_CONTROL_FILES} -t ${TMP_PACKAGE_DEB_DIR}
        COMMAND make DESTDIR=${TMP_PACKAGE_DIR} install${COMPONENT}
        COMMAND ${CMAKE_COMMAND} -E chdir ${TMP_PACKAGE_DIR} debuild
        WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
        VERBATIM
    )
endfunction()

# Making target for Windows portable ZIP
function(make_zip_target COMPONENT)

    if( COMPONENT )
        set(TMP_COMPONENT ${COMPONENT})
        set(COMPONENT "_${COMPONENT}")

        # Install target for component
        add_custom_target(install${COMPONENT}
            COMMAND
             "${CMAKE_COMMAND}" -DCMAKE_INSTALL_COMPONENT=${TMP_COMPONENT}
             -P "${CMAKE_BINARY_DIR}/cmake_install.cmake"
        )
    endif()

    set(TMP_PACKAGE_DIR "${CMAKE_BINARY_DIR}/${TMP_COMPONENT}/${CMAKE_PROJECT_NAME}")
    set(PACKAGE_FILENAME "${CMAKE_BINARY_DIR}/${CMAKE_PROJECT_NAME}_win_${VERSION}.zip")

    # Build package target for component
    add_custom_target(zip_package${COMPONENT}
        DEPENDS python_download
        COMMAND rm -rf ${TMP_PACKAGE_DIR}
        COMMAND mkdir -p ${TMP_PACKAGE_DIR}/${EMBEDDABLE_PYTHON}
        COMMAND make DESTDIR=${TMP_PACKAGE_DIR} install${COMPONENT}
        COMMAND mv ${TMP_PACKAGE_DIR}/uget-integrator ${TMP_PACKAGE_DIR}/uget-integrator.py
        # COMMAND sed -i "\"s/UGET_COMMAND = 'uget-gtk'/UGET_COMMAND = join(os.path.dirname(os.path.realpath(__file__)), \\\"..\\\\\\\\\\\\\\uGet\\\\\\\\\\\\\\bin\\\\\\\\\\\\\\uget.exe\\\")/g\"" ${TMP_PACKAGE_DIR}/uget-integrator.py
        COMMAND sed -i "\"s/UGET_COMMAND = 'uget-gtk'/UGET_COMMAND = \\\"C:\\\\\\\\\\\\\\uGet\\\\\\\\\\\\\\bin\\\\\\\\\\\\\\uget.exe\\\"/g\"" ${TMP_PACKAGE_DIR}/uget-integrator.py
        COMMAND ${CMAKE_COMMAND} -E chdir ${TMP_PACKAGE_DIR}/${EMBEDDABLE_PYTHON} ${CMAKE_COMMAND} -E tar "xf" ${CMAKE_BINARY_DIR}/${EMBEDDABLE_PYTHON}.zip -d
        COMMAND ${CMAKE_COMMAND} -E chdir ${CMAKE_BINARY_DIR}/${TMP_COMPONENT} ${CMAKE_COMMAND} -E tar "cf" ${PACKAGE_FILENAME} --format=zip ${CMAKE_PROJECT_NAME}
    )
endfunction()

# Making target for Windows installer
function(make_nsis_target COMPONENT)

    if( COMPONENT )
        set(TMP_COMPONENT ${COMPONENT})
        set(COMPONENT "_${COMPONENT}")

        # Install target for component
        add_custom_target(install${COMPONENT}
            COMMAND
             "${CMAKE_COMMAND}" -DCMAKE_INSTALL_COMPONENT=${TMP_COMPONENT}
             -P "${CMAKE_BINARY_DIR}/cmake_install.cmake"
        )
    endif()

    set(TMP_PACKAGE_DIR "${CMAKE_BINARY_DIR}/${TMP_COMPONENT}/${CMAKE_PROJECT_NAME}")
    set(PACKAGE_FILENAME "${CMAKE_BINARY_DIR}/${CMAKE_PROJECT_NAME}_win_${VERSION}_installer.zip")

    # Build package target for component
    add_custom_target(nsis_package${COMPONENT}
        DEPENDS python_download
        COMMAND rm -rf ${TMP_PACKAGE_DIR}
        COMMAND mkdir -p ${TMP_PACKAGE_DIR}/${EMBEDDABLE_PYTHON}
        COMMAND make DESTDIR=${TMP_PACKAGE_DIR} install${COMPONENT}
        COMMAND mv ${TMP_PACKAGE_DIR}/uget-integrator ${TMP_PACKAGE_DIR}/uget-integrator.py
        COMMAND ${CMAKE_COMMAND} -E chdir ${TMP_PACKAGE_DIR}/${EMBEDDABLE_PYTHON} ${CMAKE_COMMAND} -E tar "xf" ${CMAKE_BINARY_DIR}/${EMBEDDABLE_PYTHON}.zip -d
        COMMAND ${CMAKE_COMMAND} -E chdir ${CMAKE_BINARY_DIR}/${TMP_COMPONENT} ${CMAKE_COMMAND} -E tar "cf" ${PACKAGE_FILENAME} --format=zip ${CMAKE_PROJECT_NAME}
    )
endfunction()

# Make Ubuntu target
make_ubuntu_target("ubuntu")
add_custom_target(deb_package
    DEPENDS deb_package_ubuntu
    WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
)

# Make Windows portable zip
make_zip_target("win_portable")
add_custom_target(zip_package
    DEPENDS zip_package_win_portable
    WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
)

# Make Windows installer
make_nsis_target("win_installer")
add_custom_target(nsis_package
    DEPENDS nsis_package_win_installer
    WORKING_DIRECTORY ${CMAKE_BINARY_DIR}
)