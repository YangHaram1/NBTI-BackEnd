package com.nbti.dto;

public class ReferLineDTO {
	// 참조라인 dto
	private int refer_line_seq, temp_seq;
	private String referer;
	
	public ReferLineDTO(int refer_line_seq, int temp_seq, String referer) {
		super();
		this.refer_line_seq = refer_line_seq;
		this.temp_seq = temp_seq;
		this.referer = referer;
	}
	
	public ReferLineDTO() {
		super();
	}
	public int getRefer_line_seq() {
		return refer_line_seq;
	}
	public void setRefer_line_seq(int refer_line_seq) {
		this.refer_line_seq = refer_line_seq;
	}
	public int getTemp_seq() {
		return temp_seq;
	}
	public void setTemp_seq(int temp_seq) {
		this.temp_seq = temp_seq;
	}
	public String getReferer() {
		return referer;
	}
	public void setReferer(String referer) {
		this.referer = referer;
	}
	
	

}
