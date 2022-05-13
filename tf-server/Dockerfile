FROM tensorflow/tensorflow:2.9.0rc2
EXPOSE 8850/tcp

RUN pip install opencv-python-headless websockets
ADD tf-server.py /usr/bin
ADD model /model
RUN chmod +x /usr/bin/tf-server.py
ENTRYPOINT [ "/usr/bin/tf-server.py" ]